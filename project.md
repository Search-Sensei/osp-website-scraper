# OSP Website Scraper — Design Specification

## Overview

A back-office tool that clones client search pages (HTML, CSS, JS, images) and serves them locally with search functionality redirected to a configurable API endpoint. The cloned page looks visually identical to the original, but when a user searches, the request goes to our configured API and results are rendered into the original page's results container.

## Architecture

Single **Next.js 14 (App Router, TypeScript)** application with three layers:

- **Dashboard UI**: Simple table of site replications with add/delete actions and status tracking.
- **API Routes**: REST endpoints for CRUD operations and triggering the scraper.
- **Scraper Engine**: Playwright-based. Downloads the fully rendered page and all assets, rewrites URLs, injects a search interceptor script.

### Storage

- **PostgreSQL** with **Flyway** migrations for replication job tracking and configuration.
- **Local filesystem** (`public/sites/{clientId}/`) for downloaded site assets.

### Tech Stack

| Layer      | Technology                           |
| ------------| --------------------------------------|
| Framework  | Next.js 14 (App Router)              |
| Language   | TypeScript                           |
| Database   | PostgreSQL                           |
| Migrations | Flyway                               |
| Scraper    | Playwright                           |
| UI         | React (minimal, back-office styling) |

---

## Database Schema

### `site_replications` table

```sql
CREATE TABLE site_replications (
    id                          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    client_name                 VARCHAR(100) NOT NULL,
    source_url                  VARCHAR(500) NOT NULL,
    search_api_url              VARCHAR(500) NOT NULL,
    search_input_selector       VARCHAR(200) NOT NULL,
    search_button_selector      VARCHAR(200),
    results_container_selector  VARCHAR(200) NOT NULL,
    response_mapping            JSONB NOT NULL DEFAULT '{}',
    status                      VARCHAR(20) NOT NULL DEFAULT 'PENDING',
    error_message               TEXT,
    cloned_path                 VARCHAR(500),
    created_at                  TIMESTAMP DEFAULT NOW(),
    updated_at                  TIMESTAMP DEFAULT NOW()
);
```

### Status Lifecycle

`PENDING` → `COPYING` → `COMPLETED` or `FAILED`

### Response Mapping Format

```json
{
  "resultsPath": "data.results",
  "titleField": "title",
  "snippetField": "excerpt",
  "urlField": "url"
}
```

- `resultsPath`: Dot-notation path to the array of results in the API response.
- `titleField`: Field name for the result title.
- `snippetField`: Field name for the result description/snippet.
- `urlField`: Field name for the result link.

---

## API Routes

| Method | Route | Purpose |
|--------|-------|---------|
| `GET` | `/api/replications` | List all replications |
| `POST` | `/api/replications` | Create new replication & start scraping |
| `GET` | `/api/replications/[id]` | Get single replication details |
| `DELETE` | `/api/replications/[id]` | Delete replication & clean up files |

### POST /api/replications — Request Body

```json
{
  "clientName": "Community Savings Bank",
  "sourceUrl": "https://www.communitysavings.bank/search",
  "searchApiUrl": "https://osp-gateway.example.com/api/v1/search",
  "searchInputSelector": "input[name='q']",
  "searchButtonSelector": "button.search-btn",
  "resultsContainerSelector": "#search-results",
  "responseMapping": {
    "resultsPath": "data.results",
    "titleField": "title",
    "snippetField": "excerpt",
    "urlField": "url"
  }
}
```

---

## Scraper Engine (`lib/scraper.ts`)

### Flow

1. Update DB status → `COPYING`
2. Launch Playwright browser (headless Chromium)
3. Navigate to `source_url`, wait for `networkidle`
4. Collect all linked resources:
   - CSS files (from `<link>` tags)
   - JS files (from `<script src>` tags)
   - Images (from `<img>` tags and CSS `background-image`)
   - Fonts (from `@font-face` rules)
5. Download each resource to `public/sites/{id}/assets/`
6. Rewrite all URLs in the HTML to point to local relative paths
7. Remove original search form event handlers
8. Inject `search-interceptor.js` at the bottom of `<body>`:
   - Reads the per-client config (selectors, API URL, response mapping)
   - Attaches event listener to the search form/button
   - On search submit: calls configured `search_api_url` with query
   - Parses response using `response_mapping`
   - Renders results (title, snippet, URL) into `results_container_selector`
9. Save final HTML as `public/sites/{id}/index.html`
10. Update DB status → `COMPLETED` (or `FAILED` with error_message)

### Search Interceptor Script

A small JS snippet injected into every cloned page. It is parameterized with the client's configuration at injection time:

```javascript
(function() {
  const CONFIG = {
    apiUrl: '__SEARCH_API_URL__',
    inputSelector: '__SEARCH_INPUT_SELECTOR__',
    buttonSelector: '__SEARCH_BUTTON_SELECTOR__',
    resultsSelector: '__RESULTS_CONTAINER_SELECTOR__',
    mapping: __RESPONSE_MAPPING__
  };

  function getNestedValue(obj, path) {
    return path.split('.').reduce((o, k) => o?.[k], obj);
  }

  function renderResults(data) {
    const results = getNestedValue(data, CONFIG.mapping.resultsPath) || [];
    const container = document.querySelector(CONFIG.resultsSelector);
    if (!container) return;

    container.innerHTML = results.map(item => `
      <div class="osp-result-item" style="margin-bottom: 16px;">
        <a href="${item[CONFIG.mapping.urlField]}" style="font-size: 18px; color: #1a0dab; text-decoration: none;">
          ${item[CONFIG.mapping.titleField]}
        </a>
        <p style="color: #545454; margin: 4px 0 0;">
          ${item[CONFIG.mapping.snippetField] || ''}
        </p>
      </div>
    `).join('');
  }

  const input = document.querySelector(CONFIG.inputSelector);
  const button = CONFIG.buttonSelector ? document.querySelector(CONFIG.buttonSelector) : null;
  const form = input?.closest('form');

  async function doSearch() {
    const query = input?.value;
    if (!query) return;
    try {
      const res = await fetch(`${CONFIG.apiUrl}?q=${encodeURIComponent(query)}`);
      const data = await res.json();
      renderResults(data);
    } catch (err) {
      console.error('[OSP Scraper] Search failed:', err);
    }
  }

  if (form) {
    form.addEventListener('submit', (e) => { e.preventDefault(); doSearch(); });
  }
  if (button) {
    button.addEventListener('click', (e) => { e.preventDefault(); doSearch(); });
  }
})();
```

### Error Handling

- Page load timeout → `FAILED` with timeout message
- Individual asset download failure → log warning, continue (partial clone is acceptable)
- DB connection failure → API returns 500

---

## Frontend Components

### Dashboard (`app/page.tsx`)

- Heading: "Site Replications"
- "Add Site" button → opens AddSiteModal
- ReplicationTable below

### ReplicationTable (`components/ReplicationTable.tsx`)

| Column | Content |
|--------|---------|
| Client Name | Text |
| Source URL | Link |
| Search API | Truncated URL |
| Status | Badge: 🟡 PENDING, 🔵 COPYING, 🟢 COMPLETED, 🔴 FAILED |
| Actions | View (opens cloned page) · Delete |

Auto-refreshes every 5 seconds to poll for status changes.

### AddSiteModal (`components/AddSiteModal.tsx`)

Two sections:

**Basic Info:**
- Client Name (text)
- Source URL (URL input)
- Search API URL (URL input)

**Selectors & Mapping:**
- Search Input Selector (text, placeholder: `input[name="q"]`)
- Search Button Selector (text, optional)
- Results Container Selector (text, placeholder: `#search-results`)
- Response Mapping (JSON textarea, pre-filled template)

### Cloned Site Viewer (`app/sites/[id]/page.tsx`)

- Loads the saved HTML from `public/sites/{id}/index.html`
- Renders inside an iframe for isolation
- Back button to return to dashboard

---

## Project File Structure

```
osp-website-scraper/
├── app/
│   ├── page.tsx                          # Dashboard
│   ├── layout.tsx                        # Root layout
│   ├── globals.css                       # Minimal styling
│   ├── api/
│   │   └── replications/
│   │       ├── route.ts                  # GET (list), POST (create)
│   │       └── [id]/
│   │           └── route.ts              # GET (detail), DELETE
│   └── sites/
│       └── [id]/
│           └── page.tsx                  # Cloned site viewer
├── components/
│   ├── ReplicationTable.tsx
│   └── AddSiteModal.tsx
├── lib/
│   ├── db.ts                             # PostgreSQL client (pg)
│   ├── scraper.ts                        # Playwright scraper engine
│   └── search-interceptor.ts             # Interceptor template
├── public/
│   └── sites/                            # Cloned assets (gitignored)
├── flyway/
│   └── sql/
│       └── V1__create_site_replications.sql
├── flyway.conf
├── package.json
├── tsconfig.json
├── .env.local
├── .gitignore
└── README.md
```

---

## Testing Strategy

### Unit Tests
- Scraper: URL rewriting logic, search interceptor injection, response mapping parser
- API: CRUD endpoints with mocked DB

### Manual Verification
- Clone Community Savings Bank search page
- Verify visual match
- Trigger search → confirm request goes to configured API
- Confirm results render in the original results container

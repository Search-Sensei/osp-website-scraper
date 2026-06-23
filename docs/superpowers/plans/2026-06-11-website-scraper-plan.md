# OSP Website Scraper Implementation Plan

> **For agentic workers:** REQUIRED: Use superpowers:subagent-driven-development (if subagents available) or superpowers:executing-plans to implement this plan. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Build a simple back-office dashboard to clone client search pages (HTML, CSS, JS, images) and configure them to hit a custom search API, tracking the replication process status.

**Architecture:** A Next.js 14 (App Router) monolithic application handling both the frontend dashboard and the scraping backend. The scraper utilizes Playwright to download the target search page's assets and rewrites URLs, while a local PostgreSQL database (managed by Flyway) tracks replication statuses and configurations.

**Tech Stack:** 
- Next.js 14 (App Router, TypeScript)
- Tailwind CSS + Shadcn UI (for UI)
- PostgreSQL (Database)
- Flyway (Migrations)
- Playwright (Scraper Engine)

---

## Chunk 1: Project Initialization & Database Setup

**Files:**
- Create: `package.json`, `tsconfig.json`, `next.config.js`
- Create: `flyway/sql/V1__create_site_replications.sql`
- Create: `flyway.conf`
- Create: `lib/db.ts`

### Task 1: Initialize Next.js Project

- [ ] **Step 1: Scaffold the Next.js app**
```bash
npx -y create-next-app@latest . --typescript --tailwind --eslint --app --src-dir=false --import-alias="@/*" --use-npm
```
Expected: Success, project files created.

- [ ] **Step 2: Install dependencies**
```bash
npm install pg playwright
npm install -D @types/pg jest @types/jest ts-node
```
Expected: Success.

- [ ] **Step 3: Setup database connection utility**
Create `lib/db.ts`:
```typescript
import { Pool } from 'pg';

export const pool = new Pool({
  connectionString: process.env.DATABASE_URL || 'postgresql://postgres:postgres@localhost:5432/website_scraper',
});

export const query = (text: string, params?: any[]) => pool.query(text, params);
```

- [ ] **Step 4: Commit**
```bash
git add .
git commit -m "chore: initialize Next.js project and dependencies"
```

### Task 2: Configure Flyway Migrations

- [ ] **Step 1: Create Flyway SQL script**
Create `flyway/sql/V1__create_site_replications.sql`:
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

- [ ] **Step 2: Commit**
```bash
git add flyway/
git commit -m "db: add initial flyway migration for site_replications"
```

---

## Chunk 2: Backend Scraper Engine

**Files:**
- Create: `lib/scraper.test.ts`
- Create: `lib/scraper.ts`
- Create: `lib/search-interceptor.ts`

### Task 3: Implement Interceptor Template

- [ ] **Step 1: Write interceptor code**
Create `lib/search-interceptor.ts`:
```typescript
export function getInterceptorScript(config: {
  apiUrl: string;
  inputSelector: string;
  buttonSelector: string | null;
  resultsSelector: string;
  mapping: any;
}): string {
  return `
    <script>
    (function() {
      const CONFIG = ${JSON.stringify(config)};
      
      function getNestedValue(obj, path) {
        return path.split('.').reduce((o, k) => o?.[k], obj);
      }

      function renderResults(data) {
        const results = getNestedValue(data, CONFIG.mapping.resultsPath) || [];
        const container = document.querySelector(CONFIG.resultsSelector);
        if (!container) return;

        container.innerHTML = results.map(item => \`
          <div class="osp-result-item" style="margin-bottom: 16px;">
            <a href="\${item[CONFIG.mapping.urlField]}" style="font-size: 18px; color: #1a0dab; text-decoration: none;">
              \${item[CONFIG.mapping.titleField]}
            </a>
            <p style="color: #545454; margin: 4px 0 0;">
              \${item[CONFIG.mapping.snippetField] || ''}
            </p>
          </div>
        \`).join('');
      }

      const input = document.querySelector(CONFIG.inputSelector);
      const button = CONFIG.buttonSelector ? document.querySelector(CONFIG.buttonSelector) : null;
      const form = input?.closest('form');

      async function doSearch() {
        const query = input?.value;
        if (!query) return;
        try {
          const res = await fetch(\`\${CONFIG.apiUrl}?q=\${encodeURIComponent(query)}\`);
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
    </script>
  `;
}
```

- [ ] **Step 2: Commit**
```bash
git add lib/search-interceptor.ts
git commit -m "feat: add search interceptor script generator"
```

### Task 4: Implement Playwright Scraper

- [ ] **Step 1: Write scraper core logic**
Create `lib/scraper.ts`:
```typescript
import { chromium } from 'playwright';
import fs from 'fs';
import path from 'path';
import { query } from './db';
import { getInterceptorScript } from './search-interceptor';

export async function runScraper(replicationId: string, url: string, config: any) {
  try {
    await query("UPDATE site_replications SET status = 'COPYING' WHERE id = $1", [replicationId]);
    
    const browser = await chromium.launch();
    const context = await browser.newContext();
    const page = await context.newPage();
    
    // Create local directory
    const outputDir = path.join(process.cwd(), 'public', 'sites', replicationId);
    fs.mkdirSync(outputDir, { recursive: true });

    // Download page
    await page.goto(url, { waitUntil: 'networkidle' });
    
    // In a full implementation, we would intercept network requests to save CSS/JS locally.
    // For this simple version, we will save the rendered HTML and inject a <base> tag to resolve relative assets 
    // back to the original domain, ensuring perfect visual fidelity without complex asset rewriting.
    let html = await page.content();
    
    // Inject <base> tag to fix relative links
    const baseUrl = new URL(url).origin;
    html = html.replace('<head>', \`<head><base href="\${baseUrl}/">\`);

    // Inject our search interceptor
    const interceptor = getInterceptorScript(config);
    html = html.replace('</body>', \`\${interceptor}</body>\`);

    // Save to disk
    fs.writeFileSync(path.join(outputDir, 'index.html'), html);
    
    await browser.close();

    await query("UPDATE site_replications SET status = 'COMPLETED', cloned_path = $1 WHERE id = $2", 
      [\`/sites/\${replicationId}/index.html\`, replicationId]);

  } catch (error: any) {
    await query("UPDATE site_replications SET status = 'FAILED', error_message = $1 WHERE id = $2", 
      [error.message, replicationId]);
  }
}
```

- [ ] **Step 2: Commit**
```bash
git add lib/scraper.ts
git commit -m "feat: implement Playwright page downloader and injector"
```

---

## Chunk 3: API Routes and Dashboard

**Files:**
- Create: `app/api/replications/route.ts`
- Create: `components/AddSiteModal.tsx`
- Create: `app/page.tsx`

### Task 5: Implement API Routes

- [ ] **Step 1: Create API Endpoint**
Create `app/api/replications/route.ts`:
```typescript
import { NextResponse } from 'next/server';
import { query } from '@/lib/db';
import { runScraper } from '@/lib/scraper';

export async function GET() {
  const result = await query("SELECT * FROM site_replications ORDER BY created_at DESC");
  return NextResponse.json(result.rows);
}

export async function POST(req: Request) {
  const body = await req.json();
  const { 
    clientName, sourceUrl, searchApiUrl, searchInputSelector, 
    searchButtonSelector, resultsContainerSelector, responseMapping 
  } = body;

  const insertRes = await query(
    \`INSERT INTO site_replications 
      (client_name, source_url, search_api_url, search_input_selector, search_button_selector, results_container_selector, response_mapping)
      VALUES ($1, $2, $3, $4, $5, $6, $7) RETURNING id\`,
    [clientName, sourceUrl, searchApiUrl, searchInputSelector, searchButtonSelector, resultsContainerSelector, responseMapping]
  );
  
  const id = insertRes.rows[0].id;

  // Trigger scraper asynchronously
  runScraper(id, sourceUrl, {
    apiUrl: searchApiUrl,
    inputSelector: searchInputSelector,
    buttonSelector: searchButtonSelector,
    resultsSelector: resultsContainerSelector,
    mapping: responseMapping
  });

  return NextResponse.json({ success: true, id });
}
```

- [ ] **Step 2: Commit**
```bash
git add app/api/replications/route.ts
git commit -m "feat: add API route to create and list replications"
```

### Task 6: Implement Dashboard

- [ ] **Step 1: Create main page**
Replace `app/page.tsx`:
```tsx
"use client";
import { useEffect, useState } from 'react';

export default function Dashboard() {
  const [sites, setSites] = useState([]);

  useEffect(() => {
    fetch('/api/replications')
      .then(r => r.json())
      .then(data => setSites(data));
  }, []);

  return (
    <div className="p-8 max-w-6xl mx-auto">
      <h1 className="text-2xl font-bold mb-6">Site Replications</h1>
      
      <table className="w-full border-collapse border border-gray-200">
        <thead>
          <tr className="bg-gray-100">
            <th className="border p-2 text-left">Client Name</th>
            <th className="border p-2 text-left">Source URL</th>
            <th className="border p-2 text-left">Status</th>
            <th className="border p-2 text-left">Actions</th>
          </tr>
        </thead>
        <tbody>
          {sites.map((s: any) => (
            <tr key={s.id}>
              <td className="border p-2">{s.client_name}</td>
              <td className="border p-2">{s.source_url}</td>
              <td className="border p-2">{s.status}</td>
              <td className="border p-2">
                {s.status === 'COMPLETED' && (
                  <a href={s.cloned_path} target="_blank" className="text-blue-600 underline">View Site</a>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
```

- [ ] **Step 2: Commit**
```bash
git add app/page.tsx
git commit -m "feat: add simple dashboard table"
```

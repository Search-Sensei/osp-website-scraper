---
name: website-scraper-workflow
description: Automates the local developer workflow for cloning a website, configuring the search DOM template via placeholders, and pushing the final integration.
---

# Website Scraper Developer Workflow

Use this skill whenever you are tasked with adding a new site to the OSP Search platform via the local developer workflow.

## Strict Step-by-Step Execution
You must follow these 5 steps in exact order. Do not skip verification steps.

### Step 1: Clone the Website
- **Action:** Open a terminal in the `osp-website-scraper` repository.
- **Command:** Run `npm run clone -- "<URL>"` where `<URL>` is the website provided by the user.
- **Wait:** Ensure the Puppeteer script finishes downloading the completely rendered HTML and exits with success.

### Step 2: Configure the Search Template
- **Locate HTML:** Find the downloaded `index.html` (e.g., `public/sites/<domain>/index.html`).
- **Extract Template:** Find the native search result row element in the HTML. Extract its outer HTML into a javascript string template, substituting the native text with exact `{{title}}`, `{{detail}}`, and `{{url}}` placeholders.
- **Inject Script:** Insert the following `<script>` block before the closing `</body>` tag of `index.html`, adapting the `querySelector` targets to match the form and container elements of the cloned site:

```html
<script src="/scraper/assets/osp-search.js"></script>
<script>
  document.addEventListener('DOMContentLoaded', () => {
    const form = document.querySelector('.search-form-selector');
    const input = document.querySelector('#search-input-selector');
    const container = document.querySelector('.search-container-selector');

    if (!form || !input || !container) return;

    const templateString = \`
      <!-- Your extracted template with {{title}}, {{detail}}, {{url}} placeholders goes here -->
    \`;

    form.addEventListener('submit', async (e) => {
      e.preventDefault();
      const query = input.value;
      if (!query) return;

      container.innerHTML = '<div style="padding: 20px; text-align: center;">Loading search results...</div>';

      const results = await window.OSPSearch.search(query);

      container.innerHTML = '';
      if (results.length === 0) {
        container.innerHTML = '<div style="padding: 20px;">No results found.</div>';
        return;
      }

      const domNodes = window.OSPSearch.buildResultNodes(templateString, results);
      container.appendChild(domNodes);
    });
    
    const urlParams = new URLSearchParams(window.location.search);
    if (urlParams.has('q')) {
      input.value = urlParams.get('q');
      form.dispatchEvent(new Event('submit', { bubbles: true, cancelable: true }));
    }
  });
</script>
```

### Step 3: Verify and Ask Human
- **Action:** Review your injected script to ensure it correctly binds to the form.
- **Human Verification:** STOP execution and explicitly ask the user: "Please run the dashboard, view the local site, and test the search functionality to verify it correctly hits the mock API."

### Step 4: Confirm Testing Result
- **Action:** Wait for the user to confirm the mock results rendered correctly inside the native UI template.

### Step 5: Push to Git
- **Action:** Once confirmed, run `git add -A`, `git commit -m "feat: clone and configure search for <site>"`, and `git push origin main`.
- **Completion:** Notify the user that the site integration is completely finished and synced to the repository.

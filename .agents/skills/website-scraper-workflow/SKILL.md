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

### Step 2: Identify Architecture & Original Backends
- **Action:** STOP execution and explicitly ask the user two questions:
  1. "Is the original site using Client-Side Rendering (CSR/Iframe) or Server-Side Rendering (SSR) for its search experience?"
  2. "Could you please provide the original backend domains, telemetry endpoints, or search provider names (e.g., `search.domain.com`, `bam.nr-data.net`, `yext`, `algolia`)? This will help me safely remove them."
- **Wait:** Wait for the user's response before proceeding.

### Step 3: Strip Backend, Ads, and Telemetry Scripts
- **Philosophy:** The goal is to copy the client site strictly for its "look and feel" to build a demo. We do NOT want their backend or any other functionality running.
- **Action:** Open the downloaded `index.html`.
- **Search & Remove Scripts:** Using the domains and names provided by the user, find and completely delete any `<script>` tags that load the original search provider. 
- **Aggressive Ad/Telemetry Removal:** Search for and aggressively delete ALL `<script>` and `<iframe>` tags related to ads, trackers, and telemetry. Look for keywords like `google-analytics`, `googletagmanager`, `doubleclick`, `facebook`, `fbevents`, `qualtrics`, `celebrus`, etc. Wipe them out completely.
- **Search & Remove Iframes:** Also find and remove any `<iframe src="...">` that points to the provided backend domains, leaving just its empty container `div`. 
- **Why:** This is crucial to prevent the original backend from being called, to stop tracking pixels from firing, and to ensure our demo is clean, fast, and secure.

### Step 4: Inject API Interceptor
- **Locate HTML:** Find the downloaded `index.html` (e.g., `public/sites/<domain>/index.html`).
- **Inject Script:** Insert the following `<script>` block immediately after the `<head>` tag in `index.html`. Configure the `proxyConfig` array to map the site's original search vendor to our local mock API endpoint!

```html
<script>
  // --- Network Interceptor ---
  // Reverse Proxy Configuration
  const proxyConfig = [
    { match: 'yext.com', endpoint: '/scraper/api/mock-search/<site_name>' } // <-- Add other vendors (e.g. algolia) here!
  ];

  // Block unwanted telemetry, ads, and original backend calls
  const blockedDomains = ['example.com', 'doubleclick.net', 'google-analytics.com', 'googletagmanager.com', 'celebrus', 'qualtrics', 'trustarc.com'];
  const isBlocked = (url) => typeof url === 'string' && blockedDomains.some(d => url.includes(d));

  const rewriteUrl = (url) => {
    if (typeof url !== 'string') return url;
    for (const p of proxyConfig) {
      if (url.includes(p.match)) {
        try {
          const urlObj = new URL(url);
          return window.location.origin + p.endpoint + urlObj.pathname + urlObj.search;
        } catch (e) { return url; }
      }
    }
    return url;
  };

  const originalFetch = window.fetch;
  window.fetch = async function(...args) {
    let url = typeof args[0] === 'string' ? args[0] : (args[0] && args[0].url ? args[0].url : '');
    if (isBlocked(url)) return new Response('{}', { status: 200, headers: { 'Content-Type': 'application/json' } });
    
    const rewritten = rewriteUrl(url);
    if (rewritten !== url) {
      if (typeof args[0] === 'string') args[0] = rewritten;
      else if (args[0] && args[0].url) args[0] = new Request(rewritten, args[0]);
    }
    return originalFetch.apply(this, args);
  };
  
  const originalXhrOpen = XMLHttpRequest.prototype.open;
  XMLHttpRequest.prototype.open = function (method, url, ...rest) {
      if (isBlocked(url)) {
          console.warn('Blocked native XHR:', url);
          this.send = () => {
              Object.defineProperty(this, 'readyState', { value: 4 });
              Object.defineProperty(this, 'status', { value: 200 });
              Object.defineProperty(this, 'responseText', { value: '{}' });
              if (this.onreadystatechange) this.onreadystatechange();
              if (this.onload) this.onload();
          };
          return;
      }
      const rewritten = rewriteUrl(url);
      if (rewritten !== url) {
          console.log(`Proxying XHR: ${url} -> ${rewritten}`);
          url = rewritten;
      }
      originalXhrOpen.apply(this, [method, url, ...rest]);
  };

  const originalSetAttribute = Element.prototype.setAttribute;
  Element.prototype.setAttribute = function (name, value) {
      if (this.tagName && this.tagName.toLowerCase() === 'iframe' && name === 'src' && typeof value === 'string') {
          if (value.includes('pagescdn.com') || value.includes('yext.com')) {
              console.log('Intercepting cross-domain iframe setAttribute:', value);
              value = '/scraper/api/mock-iframe/[SITE_ID]?url=' + encodeURIComponent(value);
          }
      }
      return originalSetAttribute.call(this, name, value);
  };

  const iframeDesc = Object.getOwnPropertyDescriptor(HTMLIFrameElement.prototype, 'src');
  if (iframeDesc) {
      Object.defineProperty(HTMLIFrameElement.prototype, 'src', {
          get: function() { return iframeDesc.get.call(this); },
          set: function(value) {
              if (typeof value === 'string' && (value.includes('pagescdn.com') || value.includes('yext.com'))) {
                  console.log('Intercepting cross-domain iframe property assignment:', value);
                  value = '/scraper/api/mock-iframe/[SITE_ID]?url=' + encodeURIComponent(value);
              }
              return iframeDesc.set.call(this, value);
          }
      });
  }

  if (navigator.sendBeacon) {
    const originalSendBeacon = navigator.sendBeacon;
    navigator.sendBeacon = function(url, data) {
      if (isBlocked(url)) return true;
      return originalSendBeacon.apply(this, [rewriteUrl(url), data]);
    };
  }

  const originalAppendChild = Node.prototype.appendChild;
  Node.prototype.appendChild = function(node) {
    if (node && node.tagName && node.tagName.toLowerCase() === 'script' && node.src) {
      if (isBlocked(node.src)) return node;
      node.src = rewriteUrl(node.src);
    }
    return originalAppendChild.call(this, node);
  };

  const originalInsertBefore = Node.prototype.insertBefore;
  Node.prototype.insertBefore = function(node, referenceNode) {
    if (node && node.tagName && node.tagName.toLowerCase() === 'script' && node.src) {
      if (isBlocked(node.src)) return node;
      node.src = rewriteUrl(node.src);
    }
    return originalInsertBefore.call(this, node, referenceNode);
  };
  // ---------------------------
</script>
```

### Step 5: Implement Backend Mock Endpoint
- **Action:** Review your injected script to ensure it correctly binds to the form.
- **Human Verification:** STOP execution and explicitly ask the user: "Please run the dashboard, view the local site, and test the search functionality to verify it correctly hits the mock API."

### Step 6: Confirm Testing Result
- **Action:** Wait for the user to confirm the mock results rendered correctly inside the native UI template.

### Step 7: Push to Git
- **Action:** Once confirmed, run `git add -A`, `git commit -m "feat: clone and configure search for <site>"`, and `git push origin main`.
- **Completion:** Notify the user that the site integration is completely finished and synced to the repository.

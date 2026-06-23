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
        if (!path) return obj;
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

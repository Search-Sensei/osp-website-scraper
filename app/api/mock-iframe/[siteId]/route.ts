import { NextResponse } from 'next/server';

const PROXY_SCRIPT = `
    <script>
        // Reverse Proxy Configuration for iframe
        const proxyConfig = [
            { match: 'yext.com', endpoint: '/scraper/api/mock-search/[SITE_ID]' }
        ];

        const blockedDomains = ['celebrus', 'qualtrics.com', 'doubleclick.net', 'googletagmanager.com', 'google-analytics.com', 'googleadservices.com', 'fbevents.js', 'facebook.com', 'adsystem.com', 'ad.doubleclick.net', 'trustarc.com'];
        const isBlocked = (url) => typeof url === 'string' && blockedDomains.some(d => url.includes(d));

        const rewriteUrl = (url) => {
            if (typeof url !== 'string') return url;
            for (const p of proxyConfig) {
                if (url.includes(p.match)) {
                    try {
                        const urlObj = new URL(url, window.location.origin);
                        return window.location.origin + p.endpoint + urlObj.pathname + urlObj.search;
                    } catch (e) {
                        return url;
                    }
                }
            }
            return url;
        };

        const originalFetch = window.fetch;
        window.fetch = async function (...args) {
            let url = typeof args[0] === 'string' ? args[0] : (args[0] && args[0].url ? args[0].url : '');
            if (isBlocked(url)) {
                console.warn('IFrame Blocked native fetch:', url);
                return new Response(JSON.stringify({}), { status: 200, headers: { 'Content-Type': 'application/json' } });
            }

            const rewritten = rewriteUrl(url);
            if (rewritten !== url) {
                console.log(\`IFrame Proxying fetch: \${url} -> \${rewritten}\`);
                if (typeof args[0] === 'string') args[0] = rewritten;
                else if (args[0] && args[0].url) args[0] = new Request(rewritten, args[0]);
            }
            return originalFetch.apply(this, args);
        };

        const originalXhrOpen = XMLHttpRequest.prototype.open;
        XMLHttpRequest.prototype.open = function (method, url, ...rest) {
            if (isBlocked(url)) {
                console.warn('IFrame Blocked native XHR:', url);
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
                console.log(\`IFrame Proxying XHR: \${url} -> \${rewritten}\`);
                url = rewritten;
            }
            originalXhrOpen.apply(this, [method, url, ...rest]);
        };
    </script>
`;

export async function GET(request: Request, { params }: { params: Promise<{ siteId: string }> | { siteId: string } }) {
  const { searchParams } = new URL(request.url);
  const targetUrl = searchParams.get('url');
  const resolvedParams = await params;
  const siteId = resolvedParams.siteId;

  if (!targetUrl) {
    return NextResponse.json({ error: 'Missing url parameter' }, { status: 400 });
  }

  try {
    console.log(`Fetching iframe URL: ${targetUrl}`);
    const response = await fetch(targetUrl);
    let html = await response.text();

    const scriptToInject = PROXY_SCRIPT.replace('[SITE_ID]', siteId);

    // Inject our script right after <head>
    if (html.includes('<head>')) {
      html = html.replace('<head>', '<head>' + scriptToInject);
    } else {
      // If no <head>, inject at the very top
      html = scriptToInject + html;
    }

    return new NextResponse(html, {
      status: 200,
      headers: {
        'Content-Type': 'text/html; charset=utf-8',
        'Cache-Control': 'no-cache, no-store, must-revalidate',
      },
    });
  } catch (error: any) {
    console.error('Error fetching iframe:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

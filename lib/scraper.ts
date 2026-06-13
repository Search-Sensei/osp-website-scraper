import fs from 'fs';
import path from 'path';

export async function runScraper(replicationId: string, url: string): Promise<string> {
  // @ts-ignore
  const scrape = (await import('website-scraper')).default;
  const outputDir = path.join(process.cwd(), 'public', 'sites', replicationId);

  // Remove old copy if it exists
  if (fs.existsSync(outputDir)) {
    fs.rmSync(outputDir, { recursive: true, force: true });
  }

  const options = {
    urls: [url],
    directory: outputDir,
    recursive: false,
    maxRecursiveDepth: 0,
  };

  // Download the site and assets
  await scrape(options);

  // Inject our common search javascript into the downloaded index.html
  const indexPath = path.join(outputDir, 'index.html');
  if (fs.existsSync(indexPath)) {
    let html = fs.readFileSync(indexPath, 'utf-8');

    let initScript = '';

    initScript = `\n<script>
(function() {
  const init = () => {
    if (window.OSPSearch && window.OSPSearch.attachFixedAdapter) {
      window.OSPSearch.attachFixedAdapter({ apiUrl: "/scraper/api/search" });
    } else {
      console.error("OSPSearch not loaded!");
    }
  };
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
</script>`;

    const commonScript = `<script src="/scraper/assets/osp-search.js"></script>${initScript}
<script>
// Block navigation to other pages but keep JS clicks (like menus) working
document.addEventListener('click', function(e) {
  const anchor = e.target.closest('a');
  if (!anchor) return;
  const href = anchor.getAttribute('href');
  if (!href || href.startsWith('#') || href.startsWith('javascript:')) return;
  e.preventDefault();
  console.log('Navigation blocked to prevent leaving the preview mode:', href);
});
</script>`;
    html = html.replace(/<\/body>/i, `${commonScript}</body>`);
    fs.writeFileSync(indexPath, html);
  }

  // Git Auto-Push
  try {
    if (process.env.PAT) {
      console.log(`PAT detected, pushing via GitHub API...`);
      const { commitAndPushDirectory } = await import('@/lib/github');
      const repoOwner = process.env.GITHUB_REPO_OWNER || 'Search-Sensei';
      const repoName = process.env.GITHUB_REPO_NAME || 'osp-website-scraper';
      const basePathInRepo = `public/sites/${replicationId}`;
      await commitAndPushDirectory(
        repoOwner,
        repoName,
        basePathInRepo,
        outputDir,
        `feat: auto-clone site for ${replicationId}`
      );
      console.log(`Successfully pushed ${replicationId} via GitHub API.`);
    } else {
      console.log(`No PAT, falling back to local Git command...`);
      const { execSync } = require('child_process');
      execSync(`git add -f public/sites/${replicationId}`, { stdio: 'inherit' });
      execSync(`git commit -m "Auto-cloned site: ${replicationId}"`, { stdio: 'inherit' });
      execSync(`git push origin main`, { stdio: 'inherit' });
      console.log(`Successfully pushed ${replicationId} to local git.`);
    }
  } catch (err) {
    console.warn(`Git auto-push failed. See logs above. Error:`, err);
  }

  return `/sites/${replicationId}/index.html`;
}

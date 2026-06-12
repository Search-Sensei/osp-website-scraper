import { Command } from 'commander';
import { runScraper } from '../lib/scraper';
import fs from 'fs';
import path from 'path';
import crypto from 'crypto';

const program = new Command();

program
  .name('scrape')
  .description('CLI to clone a website and inject search interceptors locally')
  .requiredOption('--url <url>', 'Source URL to clone')
  .requiredOption('--name <name>', 'Client or site name')
  .action(async (options) => {
    try {
      const replicationId = options.name.toLowerCase().replace(/[\s\W]+/g, '_');
      console.log(`Starting replication for: ${options.name} (${options.url})`);

      const clonedPath = await runScraper(replicationId, options.url);
      
      const siteEntry = {
        id: replicationId,
        client_name: options.name,
        source_url: options.url,
        status: 'COMPLETED',
        cloned_path: clonedPath,
        created_at: new Date().toISOString()
      };

      const dbPath = path.join(process.cwd(), 'data', 'sites.json');
      let sites = [];
      if (fs.existsSync(dbPath)) {
        sites = JSON.parse(fs.readFileSync(dbPath, 'utf-8'));
      }
      
      const existingIndex = sites.findIndex((s: any) => s.id === replicationId);
      if (existingIndex >= 0) {
        sites[existingIndex] = siteEntry;
      } else {
        sites.push(siteEntry);
      }
      fs.writeFileSync(dbPath, JSON.stringify(sites, null, 2));

      console.log(`\nSuccessfully cloned to: ${clonedPath}`);
      console.log(`Dashboard entry added.`);
    } catch (err: any) {
      console.error(`\nError scraping site: ${err.message}`);
      process.exit(1);
    }
  });

program.parse(process.argv);

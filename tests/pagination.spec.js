const { test, expect } = require('@playwright/test');

test('Search widget pagination works correctly', async ({ page }) => {
  // Navigate to the scraper page that hosts the widget
  await page.goto('http://localhost:3000/scraper/sites/communitysavings_bank/index.html?q=checking');

  // Wait for the search widget to load results
  await page.waitForSelector('.search-item');

  // Check the initial number of results rendered on page 1
  // We configured pageSize=2 in SearchWidget.tsx
  let results = await page.$$('.search-item');
  console.log(`[Page 1] Rendered ${results.length} results`);

  // Verify the pagination text
  let paginationText = await page.textContent('.text-sm.text-slate-600.font-medium');
  console.log(`[Page 1] Pagination info: ${paginationText?.trim()}`);

  // Get the title of the first result on Page 1
  const firstTitlePage1 = await page.textContent('.search-title');
  console.log(`[Page 1] First result title: ${firstTitlePage1}`);

  // Click the 'Next' button
  console.log('Clicking "Next" button...');
  await page.click('button:has-text("Next")');

  // Wait 2 seconds for API call to complete
  await page.waitForTimeout(2000);

  // Check the number of results rendered on page 2
  results = await page.$$('.search-item');
  console.log(`[Page 2] Rendered ${results.length} results`);

  // Verify the updated pagination text
  paginationText = await page.textContent('.text-sm.text-slate-600.font-medium');
  console.log(`[Page 2] Pagination info: ${paginationText?.trim()}`);

  // Get the title of the first result on Page 2
  const firstTitlePage2 = await page.textContent('.search-title');
  console.log(`[Page 2] First result title: ${firstTitlePage2}`);

  // Check if pagination worked correctly
  expect(results.length).toBeLessThanOrEqual(2);
  expect(firstTitlePage1).not.toEqual(firstTitlePage2);
});

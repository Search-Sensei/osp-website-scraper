const { test, expect } = require('@playwright/test');

test('community savings bank search filter works', async ({ page }) => {
  // Navigate to the page with a search query "Bank"
  await page.goto('http://localhost:3000/scraper/sites/communitysavings_bank/index.html?q=Bank', { waitUntil: 'domcontentloaded' });
  
  // Wait for the results to load
  await page.waitForSelector('.featured-content-card', { state: 'visible', timeout: 15000 }).catch(() => {});
  await page.waitForSelector('text="Filter by"', { state: 'visible', timeout: 15000 });
  
  // Check that initially there are some results
  const resultCards = await page.locator('.bg-white.rounded-xl.border.shadow-sm').count();
  expect(resultCards).toBeGreaterThan(0);
  
  // Find filter chips that are not "All"
  const filterChips = await page.locator('.filter-chip:not(:has-text("All"))').all();
  
  if (filterChips.length > 0) {
    const firstFilter = filterChips[0];
    const filterText = await firstFilter.textContent();
    console.log(`Clicking on filter: ${filterText}`);
    
    await firstFilter.click();
    
    // Wait for loading to finish (the results list might briefly become transparent)
    await page.waitForTimeout(2000); // Wait for mock search to complete
    
    // Check if we still have results and not "No results found"
    const isNoResults = await page.locator('text="No results found"').isVisible();
    expect(isNoResults).toBeFalsy();
    
    // We should have some results shown
    const filteredCards = await page.locator('.bg-white.rounded-xl.border.shadow-sm').count();
    expect(filteredCards).toBeGreaterThan(0);
  } else {
    console.log('No filters available other than "All"');
  }
});

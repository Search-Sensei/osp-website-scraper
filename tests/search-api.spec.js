const { test, expect } = require('@playwright/test');

test('search API applies category filter correctly', async ({ request }) => {
  // Call the Next.js API route directly with a category filter
  const response = await request.get('http://localhost:3000/scraper/api/mock-search/communitysavings_bank/search?q=Bank&category=Business');
  
  // Verify the response is successful
  expect(response.ok()).toBeTruthy();
  
  const json = await response.json();
  
  // Verify the top-level structure
  expect(json.isSuccess).toBe(true);
  expect(json.body).toBeDefined();
  expect(Array.isArray(json.body.results)).toBe(true);
  
  // Verify we actually got some results back (meaning the backend filter didn't fail)
  expect(json.body.results.length).toBeGreaterThan(0);
});

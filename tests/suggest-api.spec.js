const { test, expect } = require('@playwright/test');

test('suggest API maps external suggestions correctly', async ({ request }) => {
  // Call the Next.js API route directly
  const response = await request.get('http://localhost:3000/scraper/api/mock-search/communitysavings_bank/suggest/bank');
  
  // Verify the response is successful
  expect(response.ok()).toBeTruthy();
  
  const json = await response.json();
  
  // Verify the top-level structure
  expect(json.isSuccess).toBe(true);
  expect(json.body).toBeDefined();
  
  // Verify our custom mapping logic: data.body.suggestions should exist and be an array of strings
  expect(Array.isArray(json.body.suggestions)).toBe(true);
  
  // Verify it mapped the objects back to string suggestions
  if (json.body.suggestions.length > 0) {
    const firstSuggestion = json.body.suggestions[0];
    expect(typeof firstSuggestion).toBe('string');
    // Ensure the suggestion is not empty
    expect(firstSuggestion.length).toBeGreaterThan(0);
  }
});

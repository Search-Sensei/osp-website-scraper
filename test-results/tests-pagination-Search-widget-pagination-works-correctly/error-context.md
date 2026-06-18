# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: tests/pagination.spec.js >> Search widget pagination works correctly
- Location: tests/pagination.spec.js:3:1

# Error details

```
Test timeout of 30000ms exceeded.
```

```
Error: page.textContent: Test timeout of 30000ms exceeded.
Call log:
  - waiting for locator('.text-sm.text-slate-600.font-medium')

```

# Page snapshot

```yaml
- generic [active] [ref=e1]:
  - navigation:
    - list [ref=e3]:
      - listitem [ref=e4]:
        - link "Home" [ref=e5] [cursor=pointer]:
          - /url: javascript:void(0)
      - listitem [ref=e6]:
        - link "Skip to main content" [ref=e7] [cursor=pointer]:
          - /url: javascript:void(0)
      - listitem [ref=e8]:
        - link "Skip to footer" [ref=e9] [cursor=pointer]:
          - /url: javascript:void(0)
    - link "Download Acrobat Reader 5.0 or higher to view .pdf files." [ref=e10] [cursor=pointer]:
      - /url: javascript:void(0)
  - generic [ref=e11]:
    - generic [ref=e12]:
      - generic [ref=e15]:
        - img "FDIC Logo" [ref=e17]
        - generic [ref=e23]: FDIC-Insured - Backed by the full faith and credit of the U.S. Government
      - generic [ref=e24]:
        - generic [ref=e25]:
          - generic [ref=e26]: Community Savings Bank
          - link "Community Savings Bank" [ref=e27] [cursor=pointer]:
            - /url: javascript:void(0)
            - img "Community Savings Bank" [ref=e29]
        - navigation "Primary" [ref=e32]:
          - button "Toggle Menu" [ref=e34] [cursor=pointer]:
            - generic [ref=e35]:
              - generic [ref=e37]: 
              - generic [ref=e38]:
                - generic [ref=e39]: Toggle
                - text: Menu
            - text: 
        - button "Open the popup for I Want To Menu " [ref=e41] [cursor=pointer]:
          - generic [ref=e42]:
            - generic [ref=e43]: Open
            - text: the popup for I Want To Menu
          - generic [ref=e44]: I Want To
          - text: 
        - button "Open the popup for Online Banking" [ref=e46] [cursor=pointer]:
          - generic [ref=e47]:
            - generic [ref=e48]: Open
            - text: the popup for Online Banking
          - generic [ref=e49]: ONLINE BANKING LOGIN
        - text: 
    - main [ref=e50]:
      - generic [ref=e51]:
        - generic [ref=e52]:
          - img "Group pointing at a laptop." [ref=e55]
          - generic:
            - generic:
              - heading "Search" [level=1]
              - navigation "Breadcrumb trail" [ref=e56]:
                - list [ref=e57]:
                  - listitem [ref=e58]:
                    - link "Home" [ref=e59] [cursor=pointer]:
                      - /url: javascript:void(0)
        - generic:
          - img "subpage graphic"
      - generic [ref=e61]:
        - heading "Results found for \"checking\"" [level=2] [ref=e62]
        - search "Content" [ref=e63]:
          - generic [ref=e64]:
            - generic [ref=e65]: Enter new search terms
            - searchbox "Enter new search terms" [ref=e66]: checking
            - button "Begin new search" [ref=e67] [cursor=pointer]: Search
        - region "Search results" [ref=e68]:
          - generic [ref=e72]:
            - generic [ref=e74]:
              - generic [ref=e75]: "Filter by:"
              - button "✓ All" [ref=e76] [cursor=pointer]:
                - generic [ref=e77]: ✓
                - text: All
            - generic [ref=e78]:
              - generic [ref=e79]:
                - generic [ref=e81]: https://www.communitysavings.bank/individuals/checking/compare-checking-accounts
                - link "Compare Checking Accounts | IA Online Banking | Rates | CSB" [ref=e82] [cursor=pointer]:
                  - /url: https://www.communitysavings.bank/individuals/checking/compare-checking-accounts
                - paragraph [ref=e83]: Home Skip to main content Skip to footer Download Acrobat Reader 5.0 or higher to view .pdf files. FDIC-Insured - Backed by the full faith and credit of the U.S. Government Community Sa...
              - generic [ref=e84]:
                - generic [ref=e86]: https://www.communitysavings.bank/wealth-management/community-wealth-management
                - link "Wealth Management | IA Financial Planning | Investments | CSB" [ref=e87] [cursor=pointer]:
                  - /url: https://www.communitysavings.bank/wealth-management/community-wealth-management
                - paragraph [ref=e88]: Home Skip to main content Skip to footer Download Acrobat Reader 5.0 or higher to view .pdf files. Community Savings Bank Toggle Menu Close Menu Search Start Site Search ...
            - generic [ref=e89]:
              - generic [ref=e90]:
                - button "First" [disabled] [ref=e91]
                - button "Prev" [disabled] [ref=e92]
              - generic [ref=e93]:
                - button "1" [ref=e94]
                - button "2" [ref=e95]
                - button "3" [ref=e96]
                - button "4" [ref=e97]
                - button "5" [ref=e98]
              - generic [ref=e99]:
                - button "Next" [ref=e100]
                - button "Last" [ref=e101]
    - contentinfo [ref=e102]:
      - generic [ref=e103]:
        - button " Back to the top" [ref=e104] [cursor=pointer]:
          - text: 
          - generic [ref=e105]: Back to the top
        - generic [ref=e106]:
          - navigation "Footer" [ref=e107]:
            - list [ref=e108]:
              - listitem [ref=e109]:
                - link "Privacy Policy" [ref=e110] [cursor=pointer]:
                  - /url: javascript:void(0)
              - listitem [ref=e111]:
                - link "Community Reinvestment Act Public File" [ref=e112] [cursor=pointer]:
                  - /url: javascript:void(0)
              - listitem [ref=e113]:
                - link "Security Policy" [ref=e114] [cursor=pointer]:
                  - /url: javascript:void(0)
          - generic [ref=e116]:
            - generic [ref=e117]: © 2026 Community Savings Bank.
            - link "Created by Banno" [ref=e119] [cursor=pointer]:
              - /url: javascript:void(0)
              - generic [ref=e120]: 
              - generic [ref=e121]: Created by Banno
            - link "Member FDIC" [ref=e123] [cursor=pointer]:
              - /url: javascript:void(0)
              - generic [ref=e124]: Member FDIC
              - generic [ref=e125]: 
            - link "Equal Housing Lender" [ref=e127] [cursor=pointer]:
              - /url: javascript:void(0)
              - generic [ref=e128]: 
    - region "Accessibility Information" [ref=e130]:
      - link "Read More About Our Accessibility Statement" [ref=e131] [cursor=pointer]:
        - /url: javascript:void(0)
        - generic [ref=e132]: Read More About Our Accessibility Statement
  - generic:
    - generic:
      - generic:
        - generic [ref=e134] [cursor=pointer]:
          - img [ref=e136]
          - generic [ref=e138]: Message Us
        - generic [ref=e139]:
          - generic [ref=e140]:
            - paragraph [ref=e141]: Community Savings Bank Assistant
            - generic [ref=e142]:
              - button "Our Team" [ref=e143]:
                - img [ref=e144]
                - generic [ref=e146]: Our Team
              - button "Close" [ref=e147]
          - generic [ref=e148]:
            - button "Group Chat" [ref=e149]
            - button "Private Chat" [ref=e150]
          - generic [ref=e151]:
            - img "logo" [ref=e152]
            - paragraph [ref=e154]: Chat with us 24/7
          - generic [ref=e157]:
            - img [ref=e159] [cursor=pointer]
            - textbox "Type a message... Use @agent or @product for suggestions" [ref=e162]
            - button "Send" [ref=e163]:
              - generic [ref=e164]: Send
```

# Test source

```ts
  1  | const { test, expect } = require('@playwright/test');
  2  | 
  3  | test('Search widget pagination works correctly', async ({ page }) => {
  4  |   // Navigate to the scraper page that hosts the widget
  5  |   await page.goto('http://localhost:3000/scraper/sites/communitysavings_bank/index.html?q=checking');
  6  | 
  7  |   // Wait for the search widget to load results
  8  |   await page.waitForSelector('.search-item');
  9  | 
  10 |   // Check the initial number of results rendered on page 1
  11 |   // We configured pageSize=2 in SearchWidget.tsx
  12 |   let results = await page.$$('.search-item');
  13 |   console.log(`[Page 1] Rendered ${results.length} results`);
  14 | 
  15 |   // Verify the pagination text
> 16 |   let paginationText = await page.textContent('.text-sm.text-slate-600.font-medium');
     |                                   ^ Error: page.textContent: Test timeout of 30000ms exceeded.
  17 |   console.log(`[Page 1] Pagination info: ${paginationText?.trim()}`);
  18 | 
  19 |   // Get the title of the first result on Page 1
  20 |   const firstTitlePage1 = await page.textContent('.search-title');
  21 |   console.log(`[Page 1] First result title: ${firstTitlePage1}`);
  22 | 
  23 |   // Click the 'Next' button
  24 |   console.log('Clicking "Next" button...');
  25 |   await page.click('button:has-text("Next")');
  26 | 
  27 |   // Wait 2 seconds for API call to complete
  28 |   await page.waitForTimeout(2000);
  29 | 
  30 |   // Check the number of results rendered on page 2
  31 |   results = await page.$$('.search-item');
  32 |   console.log(`[Page 2] Rendered ${results.length} results`);
  33 | 
  34 |   // Verify the updated pagination text
  35 |   paginationText = await page.textContent('.text-sm.text-slate-600.font-medium');
  36 |   console.log(`[Page 2] Pagination info: ${paginationText?.trim()}`);
  37 | 
  38 |   // Get the title of the first result on Page 2
  39 |   const firstTitlePage2 = await page.textContent('.search-title');
  40 |   console.log(`[Page 2] First result title: ${firstTitlePage2}`);
  41 | 
  42 |   // Check if pagination worked correctly
  43 |   expect(results.length).toBeLessThanOrEqual(2);
  44 |   expect(firstTitlePage1).not.toEqual(firstTitlePage2);
  45 | });
  46 | 
```
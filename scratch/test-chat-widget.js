const { chromium } = require('playwright');
const path = require('path');
const fs = require('fs');

async function runTest() {
  const siteId = process.argv[2] || 'nationwide_com';
  const titles = {
    'peapackprivate_com': 'Peapack Private Assistant',
    'nationwide_com': 'Nationwide Assistant',
    'communitysavings_bank': 'Community Savings Bank Assistant',
    'citizensbank_com': 'Citizens Bank Assistant'
  };
  const expectedTitle = titles[siteId] || 'Assistant';
  
  console.log(`Starting Playwright test for ${siteId} (${expectedTitle}) Chat Widget...`);
  
  const browser = await chromium.launch({ headless: true });
  const context = await browser.newContext({
    viewport: { width: 1280, height: 800 }
  });
  
  const page = await context.newPage();
  
  page.on('console', msg => {
    console.log(`[Browser Console] ${msg.type()}: ${msg.text()}`);
  });

  try {
    console.log(`Navigating to http://localhost:3000/scraper/sites/${siteId}...`);
    await page.goto(`http://localhost:3000/scraper/sites/${siteId}`, { waitUntil: 'load' });
    
    console.log('Waiting for cloned site iframe...');
    const iframeSelector = 'iframe[title="Cloned Site"]';
    await page.waitForSelector(iframeSelector);
    
    const iframe = page.frameLocator(iframeSelector);
    
    console.log('Checking for #sensei-chat-root inside iframe...');
    const chatRoot = iframe.locator('#sensei-chat-root');
    await chatRoot.waitFor({ state: 'attached', timeout: 5000 });
    console.log('#sensei-chat-root is attached.');

    const frame = page.frames().find(f => f.url().includes('index.html'));
    if (frame) {
      const containingBlock = await frame.evaluate(() => {
        let el = document.getElementById('sensei-chat-root');
        const ancestors = [];
        while (el) {
          const style = window.getComputedStyle(el);
          const hasPositioningEffect = 
            style.transform !== 'none' || 
            style.filter !== 'none' || 
            style.perspective !== 'none' ||
            style.contain !== 'none' ||
            style.willChange.includes('transform') ||
            style.willChange.includes('filter') ||
            style.containerType !== 'normal' ||
            style.overflowX === 'hidden' ||
            style.position !== 'static';
            
          if (hasPositioningEffect || el.tagName === 'BODY' || el.tagName === 'HTML') {
            ancestors.push({
              tag: el.tagName,
              id: el.id,
              className: el.className,
              position: style.position,
              transform: style.transform,
              filter: style.filter,
              contain: style.contain,
              willChange: style.willChange,
              containerType: style.containerType,
              overflowX: style.overflowX,
              width: style.width,
              scrollWidth: el.scrollWidth,
              clientWidth: el.clientWidth
            });
          }
          el = el.parentElement;
        }
        return ancestors;
      });
      console.log('Ancestors styles:', JSON.stringify(containingBlock, null, 2));
    } else {
      console.log('Could not find iframe to evaluate');
    }

    // Save screenshot of the page with the closed chat button
    const closedScreenshotPath = path.join(__dirname, '..', 'public', 'assets', 'chat-closed.png');
    await page.screenshot({ path: closedScreenshotPath });
    console.log(`Saved screenshot of closed chat to ${closedScreenshotPath}`);

    console.log('Locating and clicking "Message Us" button...');
    const messageUsBtn = iframe.locator('.designstudio-button');
    await messageUsBtn.waitFor({ state: 'visible', timeout: 5000 });
    await messageUsBtn.click();
    console.log('Clicked "Message Us" button.');

    console.log(`Waiting for ChatBox panel with title "${expectedTitle}" to appear...`);
    const chatPanel = iframe.locator(`p:has-text("${expectedTitle}")`).first();
    await chatPanel.waitFor({ state: 'visible', timeout: 5000 });
    console.log('ChatBox panel is visible.');
    console.log('Waiting 500ms for transition animation to complete...');
    await page.waitForTimeout(500);

    // Save screenshot of the open chat panel
    const openScreenshotPath = path.join(__dirname, '..', 'public', 'assets', 'chat-open.png');
    await page.screenshot({ path: openScreenshotPath });
    console.log(`Saved screenshot of open chat to ${openScreenshotPath}`);

    console.log('Sending message to Group Chat...');
    const chatInput = iframe.locator('input[placeholder*="Type a message"]');
    await chatInput.waitFor({ state: 'visible', timeout: 5000 });
    await chatInput.fill(`Hello! I want to ask about ${siteId === 'peapackprivate_com' ? 'Peapack Private' : siteId === 'communitysavings_bank' ? 'Community Savings Bank' : siteId === 'citizensbank_com' ? 'Citizens Bank' : 'Nationwide'} services.`);
    await page.keyboard.press('Enter');
    console.log('Message sent.');

    // Wait for the typing indicator or response to appear
    console.log('Waiting 25 seconds for backend response...');
    await page.waitForTimeout(25000);

    // Save screenshot of the response
    const responseScreenshotPath = path.join(__dirname, '..', 'public', 'assets', 'chat-response.png');
    await page.screenshot({ path: responseScreenshotPath });
    console.log(`Saved screenshot of chat response to ${responseScreenshotPath}`);

    console.log('\n--- Chat Messages ---');
    const messages = await iframe.locator('.markdown-content').allTextContents();
    messages.forEach((msg, idx) => {
      console.log(`Message ${idx + 1}: ${msg.trim()}`);
    });
    console.log('---------------------\n');

  } catch (err) {
    console.error('Test failed with error:', err);
    try {
      const failScreenshotPath = path.join(__dirname, '..', 'public', 'assets', 'chat-failure.png');
      await page.screenshot({ path: failScreenshotPath });
      console.log(`Saved failure screenshot to ${failScreenshotPath}`);
    } catch (e) {}
  } finally {
    await browser.close();
    console.log('Browser closed. Test finished.');
  }
}

runTest();

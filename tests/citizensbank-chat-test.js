const { chromium } = require('playwright');
const path = require('path');

(async () => {
  const siteId = 'citizensbank_com';
  const expectedTitle = 'Citizens Bank Assistant';
  
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
    console.log(`Navigating to http://localhost:3000/scraper/sites/${siteId}/index.html...`);
    await page.goto(`http://localhost:3000/scraper/sites/${siteId}/index.html`, { waitUntil: 'load' });
    
    console.log('Checking for #sensei-chat-root...');
    const chatRoot = page.locator('#sensei-chat-root');
    await chatRoot.waitFor({ state: 'attached', timeout: 5000 });
    console.log('#sensei-chat-root is attached.');

    console.log('Locating "Message Us" button inside Shadow DOM...');
    const messageUsBtn = page.locator('#sensei-chat-root').locator('.designstudio-button');
    await messageUsBtn.waitFor({ state: 'visible', timeout: 5000 });
    await messageUsBtn.click();
    console.log('Clicked "Message Us" button.');

    console.log(`Waiting for ChatBox panel with title "${expectedTitle}"...`);
    const chatPanel = page.locator('#sensei-chat-root').locator(`p:has-text("${expectedTitle}")`).first();
    await chatPanel.waitFor({ state: 'visible', timeout: 5000 });
    console.log('ChatBox panel is visible.');
    
    // Save screenshots to verify visual state
    const openScreenshotPath = path.join(__dirname, '..', 'public', 'assets', 'citizens-chat-open.png');
    await page.screenshot({ path: openScreenshotPath });
    console.log(`Saved screenshot of open chat to ${openScreenshotPath}`);

    console.log('Sending message to Group Chat...');
    const chatInput = page.locator('#sensei-chat-root').locator('input[placeholder*="Type a message"]');
    await chatInput.waitFor({ state: 'visible', timeout: 5000 });
    await chatInput.fill('Hello! I want to ask about Citizens Bank services.');
    await page.keyboard.press('Enter');
    console.log('Message sent.');

    // Wait for the response
    console.log('Waiting 15 seconds for backend response...');
    await page.waitForTimeout(15000);

    const responseScreenshotPath = path.join(__dirname, '..', 'public', 'assets', 'citizens-chat-response.png');
    await page.screenshot({ path: responseScreenshotPath });
    console.log(`Saved screenshot of chat response to ${responseScreenshotPath}`);

    console.log('\n--- Chat Messages ---');
    const messages = await page.locator('#sensei-chat-root').locator('.markdown-content').allTextContents();
    messages.forEach((msg, idx) => {
      console.log(`Message ${idx + 1}: ${msg.trim()}`);
    });
    console.log('---------------------\n');

    if (messages.length > 1) {
      console.log('Test Passed Successfully! Chat widget is fully operational on Citizens Bank.');
    } else {
      console.error('Test Failed! No messages found in the chat panel.');
      process.exit(1);
    }

  } catch (err) {
    console.error('Test failed with error:', err);
    try {
      const failScreenshotPath = path.join(__dirname, '..', 'public', 'assets', 'citizens-chat-failure.png');
      await page.screenshot({ path: failScreenshotPath });
      console.log(`Saved failure screenshot to ${failScreenshotPath}`);
    } catch (e) {}
    process.exit(1);
  } finally {
    await browser.close();
    console.log('Browser closed. Test finished.');
  }
})();

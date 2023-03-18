const { parentPort } = require("worker_threads");
const puppeteer = require("puppeteer");

(async () => {
  try {
    const browser = await puppeteer.launch({
      headless: false, // Run the browser with a visible UI
      slowMo: 100, // Slow down Puppeteer operations by 100ms
      args: ["--start-maximized"], // Start the browser maximized
    });

    // Open a new page
    const page = await browser.newPage();

    // Navigate to a URL
    await page.goto("https://example.com");

    // Get the page title
    const title = await page.title();

    // Close the browser instance
    await browser.close();
    //throw "err";
    parentPort.postMessage({ result: title });
  } catch (err) {
    parentPort.postMessage({ error: err });
  }
})();

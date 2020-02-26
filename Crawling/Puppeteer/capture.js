const puppeteer = require('puppeteer');

const main = async() => {
    const browser = await puppeteer.launch();
    const page = await browser.newPage();
    await page.goto('https://google.com');
    await page.screenshot({path:'screenshot.png'});
    await browser.close();
}

main()
const puppeteer = require('puppeteer')

const main = async () => {
    const browser = await puppeteer.launch();
    const page = await browser.newPage();
    await page.goto('https://google.com', {awaiUntil:'networkidle2'})
    await page.pdf({path:'test.pdf',format:'A4'})
    await browser.close()
}

main()
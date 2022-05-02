const puppeteer = require('puppeteer');

const crawlConcurrentNumber = async () => {
    const browser = await puppeteer.launch({
        executablePath: '/usr/bin/chromium-browser',
        args: ['--no-sandbox', '--disable-dev-shm-usage']
    });
    const page = await browser.newPage();
    await page.goto('https://whos.amung.us/stats/history/o8a6qaozg42x/');

    await page.waitForSelector('.hnavb a:last-of-type')
    await page.click('.hnavb a:last-of-type')

    await page.waitForSelector('#datatablecontainer .table tbody tr')

    const data = await page.evaluate(() => {
        return {
            time: document.querySelector('#datatablecontainer .table tbody tr td:first-of-type').textContent,
            count: document.querySelector('#datatablecontainer .table tbody tr td:last-of-type').textContent
        }
    })
    await browser.close();
    return data
};


module.exports = {crawlConcurrentNumber}

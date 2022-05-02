const express = require('express');
const path = require('path');
const app = express();
const cors = require('cors');
const puppeteer = require('puppeteer');

const crawlConcurrentNumber = async () => {
    const browser = await puppeteer.launch();
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


const http = require('http').createServer(app);
http.listen(8080, function () {
    console.log('listening on 8080')
});

app.use(cors());
app.use(express.static(path.join(__dirname, 'front/build')));

app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'front/build/index.html'))
})

app.get('/test', (req, res) => {
    res.send({test: 'test'})
})

app.get('/coin', async (req, res) => {
    const data = await crawlConcurrentNumber()
    res.send(data)
})

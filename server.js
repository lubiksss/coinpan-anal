const express = require('express');
const path = require('path');
const app = express();
const schedule = require('node-schedule');
const coin = require('./coin')
const cors = require('cors');
const client = require('prom-client');

const register = new client.Registry();
client.collectDefaultMetrics({register});
const gauge = new client.Gauge({
    name: 'concurrent_number_coinpan',
    help: 'the concurrent number of coinpan'
})
register.registerMetric(gauge)

let datas = []

const http = require('http').createServer(app);
http.listen(8080, function () {
    console.log('http://localhost:8080')
    schedule.scheduleJob('0,30 * * * * *', async () => {
        const now = new Date()
        try {
            const data = await coin.crawlConcurrentNumber()
            const number = parseInt(data.count.replace(',', ''))
            gauge.set(number)
            datas = [data, ...datas.slice(0, 9)]
            console.log(now.toString() + "데이터 긁기 성공")
        } catch {
            console.log(now.toString() + "crawlConcurrentNumber 에러, 데이터 긁기 실패")
        }
    })
});

app.use(cors());
app.use(express.static(path.join(__dirname, 'front/build')));

app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'front/build/index.html'))
})

app.get('/coin', (req, res) => {
    res.send(datas)
})

app.get('/metrics', async (req, res) => {
    res.setHeader('Content-Type', register.contentType);
    res.send(await register.metrics());
});

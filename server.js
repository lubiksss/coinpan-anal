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
    schedule.scheduleJob('0,10,20,30,40,50 * * * * *', () => {
        coin.crawlConcurrentNumber().then(data => {
            datas = [data, ...datas];
            const number = parseInt(data.count.replace(',', ''))
            gauge.set(number)
        })
    })
});

app.use(cors());
app.use(express.static(path.join(__dirname, 'front/build')));

app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'front/build/index.html'))
})

app.get('/test', (req, res) => {
    res.send({test: 'test'})
})

app.get('/coin', (req, res) => {
    res.send(datas)
})

app.get('/metrics', async (req, res) => {
    res.setHeader('Content-Type', register.contentType);
    res.send(await register.metrics());
});

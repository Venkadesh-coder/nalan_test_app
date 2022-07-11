'Hello world!'

const express = require('express');
const dotenv = require('dotenv');
dotenv.config();
const bodyParser = require('body-parser')
const webhook = require('./api/webhook');
const app = express();
app.use(bodyParser.urlencoded({ extended: false }));

// parse application/json
app.use(bodyParser.json());
const port = 80;


app.post('/api/webhook', (req, res) => {
  console.log('first line req ', req.body);
  return webhook(req, res);
});

app.get('/', (req, res) => {
    res.send('hello world');
});

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});

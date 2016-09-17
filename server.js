var express = require('express');
var bodyParser = require("body-parser");
var querystring = require('querystring');
var app = express();

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

app.get('/', function (req, res) {
  if (req.query.segments) {
    console.log(req.query.segments.split(','));
  }
  res.send('Hello World!');
});

app.listen(3000, function () {
  console.log('Example app listening on port 3000!');
});
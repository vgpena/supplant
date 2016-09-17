var express = require('express');
var bodyParser = require("body-parser");
var querystring = require('querystring');
var app = express();
var http = require('http').Server(app);
var io = require('socket.io')(http);

var segments = [];

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(express.static('./'));

io.on('connection', function(socket){
  console.log('a user connected');
  socket.on('disconnect', function(){
    console.log('user disconnected');
  });
});

setInterval(function() {
  io.emit('foundPeople', segments.join(','));
}, 200);

app.get('/update', function (req, res) {
  segments = req.query.segments.split(',');
  res.send('complete');
});

app.get('/', function (req, res) {
  res.sendFile(__dirname + '/index.html');
});

http.listen(3000, function () {
  console.log('Example app listening on port 3000!');
});

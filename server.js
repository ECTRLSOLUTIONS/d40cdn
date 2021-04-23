
var express = require('express');
var request = require('request');
var cors = require('cors');
var app = express();  
var corsOptions = {
    origin: '*',
    optionsSuccessStatus: 200
  }
app.use(cors(corsOptions))
// Forward all requests from /api to http://foo.com/api
app.use('/', function(req, res) {
    console.log(req.url)
    res.set("Content-Security-Policy", "default-src 'self'");
    req.pipe(request("https://raw.githubusercontent.com/" + req.url)).pipe(res);
});

app.listen(process.env.PORT || 3000);
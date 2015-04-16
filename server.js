var express = require('express'),
    app = express(),
    http = require('http'),
    fs = require('fs'),
    bodyParser = require('body-parser'),
    nodemailer = require("nodemailer"),
    JSONstat = require('jsonstat'),
    _ = require('lodash'),
    al = require('./algo.js'),
    request = require('request'),
    json = {}, data = {},
    port = process.env.PORT || 1337;

var file = {};

function dataRequest(addr, res){
  request(addr, function (error, response, body) {
    if (!error && response.statusCode == 200) {
      data=JSONstat(JSON.parse(response.body));
      res.setHeader('Content-Type', 'application/json');
      res.send(al(data));
      //return response;
    }
  });
}

app.use('/src', express.static(__dirname + '/src'));
app.use('/assets',express.static(__dirname + '/assets'));               // set the static files location /public/img will be /img for users
app.use('/node_modules', express.static(__dirname + '/node_modules'));
app.use(bodyParser.json()); // support json encoded bodies
app.use(bodyParser.urlencoded({ extended: true }));
app.use(function (req, res, next) {
  res.header("Access-Control-Allow-Origin", "http://localhost:8080");
  res.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE');
  res.header("Access-Control-Allow-Headers", "X-Requested-With, Content-Type");
  next();
});

// POST
// -------------------------------
// http://localhost:8080/api/users
// parameters sent with
app.post('/api/todos', function(req, res) {
    var addr = req.body.addr;
    dataRequest(addr, res);
    //var temp = fs.readFileSync('environmentGreenhouse.json', 'utf8');
    //console.log(addr);
    /**/
});

app.post('/api/email',function(req,res){
  console.log("Email");
  var mailOptions={
  from : req.body.from,
  to : req.body.to,
  subject : req.body.subject,
  text : req.body.content
  }
  console.log(mailOptions);

  smtpTransport.sendMail(mailOptions, function(error, response){
  if(error){
  console.log(error);
  res.end("error");
  }else{
  console.log("Message sent: " + response.message);
  res.end("sent");
  }
  });
});

// application -------------------------------------------------------------
app.get('*', function(req, res) {
    //res.writeHead(200, {'Content-Type':'text/html'});
    res.set('Content-Type', 'text/html');
    res.sendFile(__dirname + '/index.html'); // load the single view file (angular will handle the page changes on the front-end)
    //res.end();
});

app.listen(port);
console.log('Server started! At http://localhost:' + port);

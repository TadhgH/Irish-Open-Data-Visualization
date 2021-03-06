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
    emailAdd = "wingsofhermes666@gmail.com",
    emailPass = "42nd430n",
    md5 = require('MD5');
    port = process.env.PORT || 1337;

http.globalAgent.maxSockets = 20;

var smtpTransport = nodemailer.createTransport({
  service: "gmail",
  auth: {
  user: emailAdd,
  pass: emailPass
  }
});

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
app.post('/api/data', function(req, res) {
    var addr = req.body.addr;
    dataRequest(addr, res);
    //use dirname
    //var temp = fs.readFileSync('environmentGreenhouse.json', 'utf8');
    //console.log(addr);
    /**/
});

app.post('/api/email',function(req,res){

  if(req.body.secret == md5("heptameron")){
    var mailOptions={
      from : req.body.from,
      to : emailAdd,
      subject : req.body.subject + " : " + req.body.from,
      text : req.body.content
    }

    smtpTransport.sendMail(mailOptions, function(error, response){
      if(error){
        res.end("error");
      }else{
        res.end("sent");
      }
    });
  } else {
    res.end("error");
  }

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

//Libraries used in project
const path = require('path'),
      fs = require('fs'),
      http = require('http');
var {exec} = require('child_process');

var port = 5000; //port for local host

var reqque=[];


var proxy = http.createServer();
var server = http.createServer();


proxy.on('request',(req,res)=>{
  console.log('PROXY',req.url);
  
  http.request({localAddress:'127.0.0.1',localPort:5050},(res)=>{
    console.log('Server has responded');
  });
});

server.on('request',(req,res)=>{
  console.log('SERVER',req.url);
  res.end('server response');
});

server.listen(5050);
proxy.listen(port);

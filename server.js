//Libraries used in project
const path = require('path'),
      fs = require('fs'),
      https = require('https');
var {exec} = require('child_process');

var port = 5000; //port for local host

var reqque=[];

var {ADMINrouter,LOADstoremap}=require('./bin/vapi-admin.js');

var {AppStoreRouter,AppStore} = require('./bin/vapi-store.js');

var {Logger}=require('./bin/vapi-logger.js');

var vstore = LOADstoremap(path.join(__dirname,'store/apps'),path.join(__dirname,'store/storemaps/storemap.json'));

var vapi = require('./bin/vapi-core.js');
var japi = require('./bin/jmart/japimart.js');

vapi.SETUPpaths(
  path.join(__dirname,'controllers'),
  path.join(__dirname,'public'),
  path.join(__dirname,'../store'),
  path.join(__dirname,'../logs')
);
vapi.SETUPlogs();

var options={
  key:fs.readFileSync(path.join(__dirname,'/ssl/key.pem')),
  cert: fs.readFileSync(path.join(__dirname,'/ssl/cert.pem'))
}

https.createServer(options,(req,res)=>{
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'OPTIONS, GET');
  res.setHeader('Access-Control-Max-Age', 2592000); // 30 days
  vapi.COREproccess(req,res).then(
    result=>{
      console.log(result);
    }
  );
}).listen(port);

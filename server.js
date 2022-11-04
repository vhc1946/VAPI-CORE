//Libraries used in project
const path = require('path'),
      fs = require('fs'),
      http = require('http');
var {exec} = require('child_process');

var port = 5000; //port for local host

var reqque=[];

var {ADMINrouter,LOADstoremap}=require('./bin/vapi-admin.js');

var {AppStoreRouter,AppStore} = require('./bin/vapi-store.js');

var {LogStore,arequestlog}=require('./bin/vapi-logger.js');

var vstore = LOADstoremap(path.join(__dirname,'store/apps'),path.join(__dirname,'store/storemaps/storemap.json'));
var vapilogger = new LogStore(path.join(__dirname,'../store/logs','requestlogs.db'));

var vapi = require('./bin/vapi-core.js');
var japi = require('./bin/jmart/japimart.js');

vapi.setupmid(path.join(__dirname,'controllers'),path.join(__dirname,'public')); //access to resource files

http.createServer((req,res)=>{
  let reqlog=arequestlog({ //request tracking object
    url:req.url,
    cip:req.connection.remoteAddress,
    timein:new Date().getTime(),
  });
  //
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'OPTIONS, GET');
  res.setHeader('Access-Control-Max-Age', 2592000); // 30 days

  vapi.COREproccess(req,res,reqlog.tracker).then(
    result=>{
      //check res status
      //end res if needed
      vapilogger.LOGrequestend(reqlog); //log the end of the request
    }
  );
}).listen(port);

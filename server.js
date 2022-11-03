//Libraries used in project
const path = require('path'),
      fs = require('fs'),
      http = require('http');
var {exec} = require('child_process');

var port = 5000; //port for local host

var reqque=[];

var {ADMINrouter,LOADstoremap}=require('./bin/vapi-admin.js');

var {AppStoreRouter,AppStore} = require('./bin/vapi-store.js');

var {vapilogger,arequestlog}=require('./logger/db/logger-db.js');

var vstore = LOADstoremap(path.join(__dirname,'store/apps'),path.join(__dirname,'store/storemaps/storemap.json'));

var vapi = require('./bin/vapi-core.js');
var japi = require('./bin/jmart/japimart.js');

// MIDDLEWARES ///////////////////

vapi.midware.setupmid('controllers','bin/gui');
//////////////////////////////////


/* Acts as a router for the api

  PASSED:
  - url - entire url from request
  - pak - pack to hold the response data.(refer to rpak)

  Routes can be added to switch as needed, and are decided by the first url position.
  The pak is sent as a reference to a variable to template the body of the response.
  Changes to the pak are made directly to the pak allowing the pak to not be returned
  from the function.


*/
var RouteVAPI = (url,res,pak) =>{
  let mod = url[1].toUpperCase() || ''; //module name
  let task = '';
  try{task = url[2].toUpperCase() || ''} //task in module}
  catch{}
  return new Promise((resolve,reject)=>{
    switch(mod){
      case 'PING':{return resolve({body:"...PING"});}
      case 'JAPI':{return resolve(japi.GETj2vtable(pak,true));}
      case 'STORE':{ console.log('store');return resolve(AppStoreRouter(pak,vstore));}
      //case 'ADMIN':{return resolve(ADMINrouter(task,pak,vstore));}
    }
  });
}



http.createServer((req,res)=>{
  let reqlog=arequestlog({ //request tracking object
    url:req.url,
    timein:new Date().getTime()
  });
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'OPTIONS, GET');
  res.setHeader('Access-Control-Max-Age', 2592000); // 30 days
  vapi.corecall(req,res,RouteVAPI).then(
    result=>{
      console.log(result);
      //check res status
      //end res if needed
      vapilogger.LOGrequestend(reqlog); //log the end of the request
    }
  );
}).listen(port);

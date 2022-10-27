//Libraries used in project
const path = require('path'),
      fs = require('fs'),
      http = require('http');
var {exec} = require('child_process');
var {NEDBconnect}=require('./bin/storage/nedb-connector.js');
var port = 8080; //port for local host

var reqque=[];

var {vapiuser,ADMINrouter,LOADstoremap}=require('./bin/vapi-admin.js');

var {AppStoreRouter,AppStore} = require('./bin/vapi-store.js');

var {vapilogger,arequestlog}=require('./logger/db/logger-db.js');

var vstore = LOADstoremap(path.join(__dirname,'store/apps'),path.join(__dirname,'store/storemaps/storemap.json'));

var RouteVAPI = (url,pak) =>{
  let mod = url[1].toUpperCase() || ''; //module name
  let task = '';
  try{task = url[2].toUpperCase() || ''} //task in module}
  catch{}
  return new Promise((resolve,reject)=>{
    switch(mod){
      /*
      case 'REPORTING':{
        console.log(333);
        fs.readFile('./controllers/index.html',(err,doc)=>{
        if(err){
          res.writeHead(500);
          res.end('Error');
        }
        res.writeHead(200,{'Content-Type':'text/html'})
        res.end(doc,'utf-8');
      });
      return true;
      break;
    }*/
      case 'TEST':{return resolve({body:"330300303"})}
      case 'APP':{return resolve(AppStoreRouter(pak,vstore));}
      case 'ADMIN':{return resolve(ADMINrouter(task,pak,vstore));}
    }
  });
}

http.createServer((req,res)=>{
  let reqlog=arequestlog({ //request tracking object
      url:req.url,
      timein:new Date().getTime()
    });

  let data=''; //to accept data
  req.on('data',chunk=>{data+=chunk;});
  req.on('end',()=>{
    try{data=JSON.parse(data);}catch{data={}}
    if(data!=''&&data.access!=undefined){ //check if data is formated
      let rspak={ //prep api response object
        msg:'Could not log in..',
        success:false,
        body:{}
      }
      vapiuser.AUTHuser(data.access).then(//check user can access
        auth=>{
          if(auth){//user cleared
            rspak.success=true;
            rspak.msg='Has Logged in'
            rspak.data = data; //attach the request data
            reqlog.success=true; //update request log item

            RouteVAPI(req.url.split('/'),rspak).then(
              answr=>{
                  rspak.success = answr;
                  res.write(JSON.stringify(rspak)); //write the result to the response
                  vapilogger.LOGrequestend(reqlog); //log the end of the request
                  res.end();
                  console.log('here')
                  exec(`sh gitsetup.sh`,(err,stdout,stderr)=>{
                  });
              }
            );
          }else{//user not cleard
          res.write(JSON.stringify(rspak)); //write the result to the response
          vapilogger.LOGrequestend(reqlog); //log the end of the request
          res.end(); //end the request
          }
        }
      );
    }else{
      fs.readFile('./controllers/index.html',(err,doc)=>{
          if(err){
            res.writeHead(500);
            res.end();
          }else{
            res.writeHead(200,{'Content-Type':'text/html'});
            res.end(doc,'utf-8');
          }
          vapilogger.LOGrequestend(reqlog); //log the end of the request
        });
      //res.write('bad request');console.log('BAD BODY');res.end()
    }
  });
}).listen(port);

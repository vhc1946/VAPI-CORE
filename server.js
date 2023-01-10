//Libraries used in project
const path = require('path'),
      fs = require('fs'),
      https = require('https'),
      url = require('url');
var {exec} = require('child_process');

let port = 5000; //port for local host

let reqque=[];

let vapi = require('./bin/vapi-core.js');

vapi.SETUPpaths(
  path.join(__dirname,'controllers'),
  path.join(__dirname,'public'),
  path.join(__dirname,'../data'),
  path.join(__dirname,'../logs')
);

var options={
  key:fs.readFileSync(path.join(__dirname,'/ssl/key.pem')),
  cert:fs.readFileSync(path.join(__dirname,'/ssl/cert.pem'))
}

var server=https.createServer(options);

server.on('request',(req,res)=>{
  if(req.rawHeaders['Sec-Fetch-Site']!='same-origin'){
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'OPTIONS, POST');
    res.setHeader('Access-Control-Max-Age', 2592000); // 30 days
  }
  let data = '';
  /////////////////////////////////////////
  if(req.url.includes('~')){ //correct to public
    req.url = '/'+req.url.split('~')[1];
    console.log(req.url);
  }

  /////////////////////////////////////////

  req.on('data',chunk=>{data+=chunk;});

  req.on('end',()=>{
    try{data=JSON.parse(data);}catch{data={};}

    if(Object.keys(data).length>0){ //does the data have any

      let newreq = new VAPIrequest({
        req:req,
        res:res,
        data:data,
      });
      let newreq = COREprocess(req,req,vpak)
      reqque.push(newreq);

      newreq.handler.then(
        answr=>{
          console.log(newreq.pak);
          newreq.resolved = true;
          //remove from reqque
        }
      );

      console.log('Request Que: ',reqque);
    }else{
      vapi.SERVEresource(req,res,vpak,logr).then(
        res=>{}
      );
    }
  });
})

server.listen(port);

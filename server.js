//Libraries used in project
const path = require('path'),
      fs = require('fs'),
      https = require('https'),
      http = require('http'),
      url = require('url');
var {exec} = require('child_process');

let port = 5000; //port for local host

let reqque=[];

var options={
  key:fs.readFileSync(path.join(__dirname,'/ssl/key.pem')),
  cert:fs.readFileSync(path.join(__dirname,'/ssl/cert.pem'))
}

var server=https.createServer(options);

server.on('request',(req,res)=>{
  if(req.rawHeaders['Sec-Fetch-Site']!='same-origin'){
    //res.setHeader('Access-Control-Allow-Origin', '*');
    //res.setHeader('Access-Control-Allow-Methods', 'OPTIONS, POST');
    res.setHeader('Access-Control-Max-Age', 2592000); // 30 days
  }
  let data = '';

  /////////////////////////////////////////
  if(req.url.includes('~')){ //correct to public
    req.url = '/'+req.url.split('~')[1];
    //console.log(req.url);
  }

  /////////////////////////////////////////

  req.on('data',chunk=>{data+=chunk;});

  req.on('end',()=>{
    try{data=JSON.parse(data);}catch{data={};}

    if(Object.keys(data).length>0){
    }else{
      console.log('resources');
      let vroption={
        hostname:'127.0.0.1',
        port:'4000',
        path:req.url,
        method:req.method
      }

      let vresource = http.request(vroption,(vres)=>{
        res.rawHeaders=vres.rawHeaders;
        res.setHeader('Content-Type',vres.rawHeaders[3]);
        vres.pipe(res);
      });
      req.pipe(vresource,{end:true});
    }
  });
})

server.listen(port,()=>{console.log('VAPI Core Listening: ',port)});

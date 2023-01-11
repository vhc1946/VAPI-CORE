//Libraries used in project
const path = require('path'),
      fs = require('fs'),
      http = require('http'),
      https = require('https');
var {exec} = require('child_process');

var port = 5000; //port for local host

var reqque=[];

let options={
  key:fs.readFileSync(path.join(__dirname,'/ssl/key.pem')),
  cert:fs.readFileSync(path.join(__dirname,'/ssl/cert.pem')),
  csr:fs.readFileSync(path.join(__dirname,'/ssl/csr.pem'))
}

var proxy = https.createServer(options);

proxy.on('request',(req,res)=>{
  console.log('PROXY',req.url);
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'OPTIONS, GET');
  res.setHeader('Access-Control-Max-Age', 2592000); // 30 days
  req.on('data',chunk=>{data+=chunk;});
  req.on('end',()=>{
    console.log(data);
    try{data=JSON.parse(data);}catch{data={};}
    let vpak={ //prep vapi response pack object
      msg:'Recieved Request',
      success:true,
      body:{},
      data:data
    }
    res.write('hello');
    res.end();
  });

});

let option={
  hostname:'127.0.0.1',
  port:'4000',
  path:'/',
  method:'GET',
  header:{
    'Content-Type':'application/json'
  }
}
let req = http.request(option,(res)=>{
  let data='';
  console.log('Server has responded');
  res.on('data',chunk=>{data+=chunk;console.log(data)});
  res.on('end',()=>{
    console.log(data);
    try{data=JSON.parse(data);}catch{data={};}
    let vpak={ //prep vapi response pack object
      msg:'Recieved Request',
      success:true,
      body:{},
      data:data
    }
  });
});
req.write('hell0');

proxy.listen(port);
console.log(proxy.address(),' Listening on ', port);

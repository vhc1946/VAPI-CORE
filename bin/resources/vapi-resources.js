var fs = require('fs'),
    path = require('path');

var sharePaths = (views,pubs)=>{
  pubroot = pubs;
  viewroot = views;
}

var pubroot = null;
var servepublic = (url,res)=>{
  return new Promise((resolve,reject)=>{
    var contype = '';

    if(url.match('\.js$')){contype='text/javascript';}
    else if(url.match('\.css$')){contype='text/css';}
    else if(url.match('\.png$')){contype='image/png';}
    else{return resolve(false);}

    fs.readFile(path.join(pubroot, url),(err,con)=>{
      if(!err){
        res.setHeader('X-Content-Type-Options','nosniff');
        res.writeHead(200, {"Content-Type": contype});
        res.end(con);
        return resolve(true);
      }else{
        res.writeHead(404);
        res.end();
        return resolve(true);
      }
    });
  });
}

var viewroot = null;
var servecontrol = (url="",res=null)=>{
  return new Promise((resolve,reject)=>{
    if(res){
      fs.stat(`${path.join(viewroot,url)}.html`,(err,stat)=>{
        if(err){
          fs.readFile(path.join(viewroot,'vapi.html'),(err,doc)=>{
            if(err){//send to landingd?
              res.writeHead(500);
              res.end();
              return resolve({success:true,msg:'Bad Page'});
            }else{//load requested page
              res.writeHead(200,{'Content-Type':'text/html'});
              res.end(doc);
              return resolve({success:true,msg:'Good Page'});
            }
          });
        }
        else{
          fs.readFile(`${path.join(viewroot,url)}.html`,(err,doc)=>{
            if(err){//send to landingd?
              res.writeHead(500);
              res.end();
              return resolve({success:true,msg:'Bad Page'});
            }else{//load requested page
              res.writeHead(200,{'Content-Type':'text/html'});
              res.end(doc,'utf-8');
              return resolve({success:true,msg:'Good Page'});
            }
          });
        }
      });
    }else{return resolve({success:false,msg:'No Response Object'});}
  });
}

module.exports={
  sharePaths,
  servepublic,
  servecontrol
}


var path = require('path');
var fs = require('fs');
var {UStore} = require('./admin/vapi-user-store.js');
var vapiuser = new UStore(path.join(__dirname,'../store/admin/vapiusers.db'));


var midware = {
  views:null,
  public:null,
}
var setupmid=(v,p)=>{
  midware.views=v;
  midware.public=p;
}

/* Acts as a router for the api

  PASSED:
  - url - entire url from request
  - pak - pack to hold the response data.(refer to rpak)

  Routes can be added to switch as needed, and are decided by the first url position.
  The pak is sent as a reference to a variable to template the body of the response.
  Changes to the pak are made directly to the pak allowing the pak to not be returned
  from the function.


*/
var RouteVAPI = (url,res,vpak) =>{
  return new Promise((resolve,reject)=>{
    switch(vpak.request){
      case 'PING':{return resolve({body:"...PING"});}
      case 'CONSOLE':{
        /*
        */
      }
      case 'JAPI':{return resolve(japi.GETj2vtable(pak,true));}
      case 'API':{return resolve(AppStoreRouter(pak,vstore));}
      //case 'ADMIN':{return resolve(ADMINrouter(task,pak,vstore));}
    }
  });
}

var COREproccess=(req,res,log)=>{
  return new Promise((resolve,reject)=>{
    console.log(req.connection.remoteAddress)
    let data=''; //to accept data
    let url1 = req.url[1]!=undefined?req.url[1].toUpperCase(): '';

    req.on('data',chunk=>{data+=chunk;});
    req.on('end',()=>{
      try{data=JSON.parse(data);}catch{data={}}
      let vpak={ //prep vapi response pack object
        msg:'Recieved Request',
        success:true,
        body:{},
        data:data
      }
      log.push(JSON.parse(JSON.stringify(vpak)));
      /* AUTH request
         Need to ensure that before the request goes on, the data is checked for
         validity. If there is no data the request is likely a resource or page
         path, and not a request for data. Alternatively, the data contains
         expected values before continuing.
      */
      if(AUTHdata(data)){ //check if data is formated
        vpak.msg='Check Access'
        vapiuser.AUTHuser(data.access).then(//check user can access
          auth=>{
            vpak.success=auth;
            log.push(JSON.parse(JSON.stringify(vpak)));
            if(auth){//user cleared
              vpak.msg='Fufill Request'
              RoutVAPI(res,vpak).then(
                answr=>{
                  vpak.success = answr;
                  log.push(JSON.parse(JSON.stringify(vpak)));
                  res.write(JSON.stringify(vpak)); //write the result to the response
                  res.end();
                  return resolve(vpak);
                }
              )
            }else{
              res.write(JSON.stringify(vpak)); //write the result to the response
              res.end(); //end the request
              return resolve(vpak);
            }
          }
        );
      }else{
        vpak.msg="Get Resource";
        servepublic(req.url,res).then(
          was=>{
            vpak.success=was;
            log.push(JSON.parse(JSON.stringify(vpak)));
            if(was){return resolve(vpak);}
            else{return resolve(servecontrol(req.url,res))}
          }
        )
      }
    });
  });
}

var AUTHdata=(data)=>{
  if(data!=''&&data!=undefined){
    if(data.access!=undefined){
      //do more checks on data
      return true;
    }
    else{return false;}
  }else{return false;}
}

var servepublic = (url,res)=>{
  return new Promise((resolve,reject)=>{
    var contype = '';

    if(url.match('\.js$')){contype='text/javascript';}
    else if(url.match('\.css$')){contype='text/css';}
    else if(url.match('\.png$')){contype='image/png';}
    else{return resolve(false);}

    fs.readFile(path.join(midware.public, url),(err,con)=>{
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

var servecontrol = (url="",res=null)=>{
  return new Promise((resolve,reject)=>{
    if(res){
      fs.stat(`${path.join(midware.views,url)}.html`,(err,stat)=>{
        if(err){
          fs.readFile(path.join(midware.views,'vapi.html'),(err,doc)=>{
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
          fs.readFile(`${path.join(midware.views,url)}.html`,(err,doc)=>{
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
  COREproccess,
  setupmid
}


var path = require('path');
var url = require('url');
var fs = require('fs');
var {UStore} = require('./admin/vapi-user-store.js');
var {NEDBconnect} =require('./storage/nedb-connector.js');
var {Logger}=require('./vapi-logger.js');

var vapiuser = new UStore(path.join(__dirname,'../store/admin/vapiusers.db'));

var japi = require('./jmart/japimart.js');

var vapipaths = {
  views:null,
  public:null,
  store:null,
  logs:null,
}

var SETUPpaths=(v,p,s,l)=>{
  vapipaths.views=v;
  vapipaths.public=p;
  vapipaths.store=s;
  vapipaths.logs=l;
}

var clog = null;
var elog = null;
var rlog = null;
var SETUPlogs=()=>{
  clog = new Logger('COREprocess','console',vapipaths.logs);
  elog = new Logger('COREprocess','error',vapipaths.logs);
  rlog = new Logger('COREprocess','request',vapipaths.logs);
}

var COREproccess=(req,res)=>{
  return new Promise((resolve,reject)=>{
    let data=''; //to accept data
    let logr = rlog.newitem({
      process:'COREprocess',
      info:{
        url:req.url,
        cip:req.connection.remoteAddress
      }
    });
    let url1 = req.url.split('/')[1]!=undefined?req.url.split('/')[1].toUpperCase(): '';

    req.on('data',chunk=>{data+=chunk;});
    req.on('end',()=>{
      try{data=JSON.parse(data);}catch{data={}}
      let vpak={ //prep vapi response pack object
        msg:'Recieved Request',
        success:true,
        body:{},
        data:data
      }
      logr.info.tracker.push(JSON.parse(JSON.stringify(vpak)));
      switch(url1){
        case 'API':{
          logr.info.cat="API";
          vpak.msg='Auth data';
          clog.LOGitem(clog.newitem({process:'CORE',msg:'Recieved API Request'}));
          waiter=COREapi(req,res,vpak,logr);
          break;
        }
        case 'CONSOLE':{
          logr.info.cat="API";
          vpak.msg='console';
          //clog.LOGitem(clog.newitem({process:'CORE',msg:'Recieved Console Request'}));
          waiter=CONNECTconsole(req,res,vpak,logr);
          break;
        }
        case 'LOGIN':{
          clog.LOGitem(clog.newitem({process:'CORE',msg:'Recieved Login Request'}));
          waiter=UserAccess(req,res,vpak,logr);
          break;
        }
        default:{//requesting resources
          logr.info.cat="PUB";
          vpak.msg="Get Resource";
          clog.LOGitem(clog.newitem({process:'CORE',msg:'Recieved Resource Request'}));
          waiter=SERVEresource(req,res,vpak,logr);
        }
      }
      if(waiter){
        waiter.then(
          pak=>{
            rlog.LOGitem(logr);
            clog.LOGitem(clog.newitem({process:'CORE',msg:'Request being ended'}))
            res.end();
            return resolve(vpak);
          }
        )
      }else{//worst case
        //res.end();
        //return resolve(vpak);
      }
    });
  });
  }

////////////////////////////////////////////////////////////////////////////////

/* Acts as a router for the api

  PASSED:
  - url - entire url from request
  - pak - pack to hold the response data.(refer to rpak)

  Routes can be added to switch as needed, and are decided by the first url position.
  The pak is sent as a reference to a variable to template the body of the response.
  Changes to the pak are made directly to the pak allowing the pak to not be returned
  from the function.


*/
var RouteVAPI = (res,vpak) =>{
  return new Promise((resolve,reject)=>{
    clog.LOGitem(clog.newitem({process:'API',msg:vpak}));
    switch(vpak.data.access.request.toUpperCase()){
      case 'PING':{return resolve({body:"...PING"});}
      case 'JAPI':{return resolve(japi.GETj2vtable(vpak,true));}
      case 'STORE':{return resolve(AppStoreRouter(vpak,vstore));}
    }
  });
}

var COREapi=(req,res,vpak,log)=>{
  return new Promise((resolve,reject)=>{
    clog.LOGitem(clog.newitem({process:'API',msg:'API starting...'}));
    /* AUTH request
       Need to ensure that before the request goes on, the data is checked for
       validity. If there is no data the request is likely a resource or page
       path, and not a request for data. Alternatively, the data contains
       expected values before continuing.
    */
    if(AUTHdata(vpak.data)){ //check if data is formated
      clog.LOGitem(clog.newitem({process:'API',msg:'Data was Authorized...'}));
      vpak.success=true;
      log.info.access=vpak.data.access;
      log.info.tracker.push(JSON.parse(JSON.stringify(vpak)));
      vpak.msg='Check Access'
      vapiuser.AUTHuser(vpak.data.access).then(//check user can access
        auth=>{
          vpak.success=auth;
          log.info.tracker.push(JSON.parse(JSON.stringify(vpak)));
          clog.LOGitem(clog.newitem({process:'API',msg:`User ${vpak.data.access.user} Authorization: ${auth}`}));
          if(auth){//user cleared
            vpak.msg='Fullfill Request'
            RouteVAPI(res,vpak).then(
              answr=>{
                clog.LOGitem(clog.newitem({process:'API',msg:`Request for informaiton: ${answr}`}));
                vpak.success = answr;
                log.info.tracker.push(JSON.parse(JSON.stringify(vpak)));
                res.write(JSON.stringify(vpak));
                return resolve({res:res,pak:vpak});
              }
            )
          }else{
            res.write(JSON.stringify(vpak));
            return resolve({res:res,pak:vpak});
          }
        }
      );
    }else{
      clog.LOGitem(clog.newitem({process:'API',msg:'Data Failed Authorization...'}));
      vpak.success=false;
      log.info.tracker.push(JSON.parse(JSON.stringify(vpak)));
      res.write(JSON.stringify(vpak));
      return resolve({res:res,pak:vpak});
    }
  })
}

var CONNECTconsole=(req,res,vpak,log)=>{
  return new Promise((resolve,reject)=>{
    //clog.LOGitem(clog.newitem({process:'CONSOLE',msg:'Console...'}));
    if(vpak.data.access!=undefined){
      switch(vpak.data.method.toUpperCase()){
        case 'LOGIN':{
          vapiuser.AUTHuser(vpak.data.access).then(//check user can access
            auth=>{
              vpak.data.connected = auth;
              vpak.data.method='STREAM';
              res.write(JSON.stringify(vpak));
              return resolve({res:res,pak:vpak});
            }
          );
          break;
        }
        case 'STREAM':{
          if(vpak.data.connected){
            vpak.data.msg ='writing data';
            if(
              vpak.data.log.name=='request' ||
              vpak.data.log.name=='error' ||
              vpak.data.log.name=='console'
            ){
              let logstore = new Logger('CONSOLE STREAM',vpak.data.log.name,vapipaths.logs);
              logstore.QUERYdb({timein:{$gte:vpak.data.log.rangeend}}).then(
                result=>{
                  vpak.data.log.rangeend=new Date().getTime();
                  vpak.body=result;
                  res.write(JSON.stringify(vpak));
                  return resolve({res:res,pak:vpak});
                }
              )
            }else{
              vpak.data.connected=false;
              vpak.data.msg='no log';
              res.write(JSON.stringify(vpak));
              return resolve({res:res,pak:vpak});
            }
          }else{
            vpak.data.msg='no connection';
            res.write(JSON.stringify(vpak));
            return resolve({res:res,pak:vpak});
          }
          break;
        }
        default:{
          vpak.data.msg='no connection';
          vpak.data.connected=false;
          res.write(JSON.stringify(vpak));
          return resolve({res:res,pak:vpak});
        }
      }
    }else{
      servecontrol('/admin/console',res,vpak,log).then(
        pak=>{return resolve({res:res,pak:pak});}
      );
    }
  })
}

var UserAccess=(req,res,vpak,log)=>{
  return new Promise((resolve,reject)=>{
    clog.LOGitem(clog.newitem({process:'LOGIN',msg:'User Login...'}));
    log.info.cat='LOGIN';
    vpak.msg='Auth data';
    if(AUTHdata(vpak.data)){
      clog.LOGitem(clog.newitem({process:'LOGIN',msg:'Request Data Authorized...'}));
      vpak.success=true;
      log.info.tracker.push(JSON.parse(JSON.stringify(vpak)));
      vpak.msg='Auth user';
      vapiuser.AUTHuser(vpak.data.access).then(
        auth=>{
          clog.LOGitem(clog.newitem({process:'LOGIN',msg:`User Authorization: ${auth}`}));
          vpak.success=auth;
          res.write(JSON.stringify(vpak));
          return resolve({res:res,pak:vpak});
        }
      );
    }else{
      clog.LOGitem(clog.newitem({process:'LOGIN',msg:'Data failed Authorization'}));
      vpak.success=false;
      log.info.tracker.push(JSON.parse(JSON.stringify(vpak)));
      res.write(JSON.stringify(vpak));
      return resolve({res:res,pak:vpak});
    }
  });
}

var SERVEresource=(req,res,vpak,log)=>{
  return new Promise((resolve,reject)=>{
    clog.LOGitem(clog.newitem({process:'RESOURCE',msg:'Request from Public...'}));
    log.info.cat="PUB";
    vpak.msg="Get Resource";
    servepublic(req.url,res).then(
      was=>{
        vpak.success=was;
        log.info.tracker.push(JSON.parse(JSON.stringify(vpak)));
        clog.LOGitem(clog.newitem({process:'RESOURCE',msg:`Was found: ${was}`}));
        if(was){
          return resolve({res:res,pak:vpak});
        }
        else{
          clog.LOGitem(clog.newitem({process:'RESOURCE',msg:'Check for page'}));
          servecontrol(req.url,res).then(
            con=>{
              clog.LOGitem(clog.newitem({process:'RESOURCE',msg:`Found page: ${con.success}`}));
              return resolve({res:res,pak:vpak});
            }
          );
        }
      }
    );
})
}

////////////////////////////////////////////////////////////////////////////////

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

    fs.readFile(path.join(vapipaths.public, url),(err,con)=>{
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
      fs.stat(`${path.join(vapipaths.views,url)}.html`,(err,stat)=>{
        if(err){
          fs.readFile(path.join(vapipaths.views,'vapi.html'),(err,doc)=>{
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
          fs.readFile(`${path.join(vapipaths.views,url)}.html`,(err,doc)=>{
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
  SETUPpaths,
  SETUPlogs
}

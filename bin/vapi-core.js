
var path = require('path');
var http = require('http');
var url = require('url');
var fs = require('fs');
var {UStore} = require('./admin/vapi-user-store.js');
var {NEDBconnect} =require('./storage/nedb-connector.js');
var {Logger}=require('./vapi-logger.js');

var vmart = require('./datamart/vapi-datamart.js');
var japi = require('./jmart/japimart.js');

var vroutes = {
  'PING':{
    request:()=>{return {body:'...PING'}}
  },
  'MART':{
    request:(res,pak)=>{
      return(VAPIrequester(this.res,this.pak,{
        hostname:'127.0.0.1',
        port:'4000',
        path:'/',
        method:'PUT',
        header:{
          'Content-Type':'application/json'
        }
      }))
    }
  },
  'JAPI':{
    request:(res,pak)=>{
    return(VAPIrequester(this.res,this.pak,{
      hostname:'127.0.0.1',
      port:'5050',
      path:'/',
      method:'PUT',
      header:{
        'Content-Type':'application/json'
      }
    }))
  }
  }
}

/* VAPI REQUEST: Should help manage http/https request / response

  Intakes information passed from the server and starts trying to resolve the
  request of the 'pak'. Upon creation, the item is stamped and the request is
  attempted to be fullfiled. After creation, this.handler.then() can be called
  to watch for return of the request.

  constructor

  this.
  - req - http server request
  - res - http server response
  - pak - packet describing the request
  - log - log to track request activity
  - routes - object describing abailable routes
  - resolved - (BOOLEAN) if the request is completed


*/
class VAPIrequest{
  constructor({
    req,
    res,
    data,
    routes=vroutes
  }){
    this.req = req;
    this.res = res;
    this.info = {
      url:this.req.url,
      route:this.req.url.split('/')[1]!=undefined?this.req.url.split('/')[1].toUpperCase(): '',
      cip:this.req.connection.remoteAddress,
    };

    this.pak = {
      msg:'Recieved Request',
      success:true,
      body:{},
      data:data
    };

    this.log = {
      timein:new Date().getTime(),
      timeout:null,
      track:[]
    };
    this.LOGactivity();

    this.routes = routes;
    this.resolved = false;
  }

  handler(){}
  router(){
    return new Promise((resolve,reject)=>{
      if(this.)
      let route = this.pak.data.access.request;
      if(this.routes[route!=undefined]){//is a route
        return resolve(this.routes[route](this.req,this.pak));
      }else{this.pak.msg='NO Route found';return resolve(false);}
    });
  }

  LOGactivity(msg='',final=false){
    this.pak.msg = msg;
    this.log.track.push(JSON.parse(JSON.stringify(this.pak)));
    if(final){
      this.log.timeout = new Date().getTime();
    }
  }
  AUTHdata(data){
    if(data!=''&&data!=undefined){
      if(data.access!=undefined){
          //check packs based on request
          return true;
      }else{return false;}
    }else{return false;}
  }
}

vmart.INITcollections(path.join(__dirname,'../../data/'));

var vapiuser = new UStore(path.join(__dirname,'../../data/store/company/EMPLOYEES/company-users.db'));

var vapipaths = {
  views:null,
  public:null,
  data:null,
  logs:null,
}

var SETUPpaths=(v,p,d,l)=>{
  vapipaths.views=v;
  vapipaths.public=p;
  vapipaths.data=d;
  vapipaths.logs=l;

  vapiresource.sharePaths(vapipaths.views,vapipaths.public); //share paths with vapiresource file
}

var clog = {};
var elog = {};
var rlog = {};

var SETUPlogs=()=>{
  clog = new Logger('COREprocess','console',vapipaths.logs);
  elog = new Logger('COREprocess','error',vapipaths.logs);
  rlog = new Logger('COREprocess','request',vapipaths.logs);
  return rlog;
}

/* Core Process
*/
var COREprocess=(req,res,vpak,logr)=>{
  return new Promise((resolve,reject)=>{
    let url1 = req.url.split('/')[1]!=undefined?req.url.split('/')[1].toUpperCase(): '';
    let waiter = null;
    logr.info.tracker.push(JSON.parse(JSON.stringify(vpak)));
    if(AUTHdata(vpak.data)){
      switch(url1){
        case 'API':{
          logr.info.cat="API";
          vpak.msg='Auth data';
          clog.LOGitem(clog.newitem({process:'CORE',msg:'Recieved API Request'}));
          return new VAPIrequest({
            COREapi(req,res,vpak,logr)
          });
        }
        case 'ADMIN':{ //portal for admin
          logr.info.cat="ADMIN";
          vpak.msg='requesting as administrator';
          console.log('requesting admin...')
          waiter=COREadmin(req,res,vpak,logr);
          break;
        }
        case 'CONSOLE':{ //'console' stream
          logr.info.cat="CONSOLE";
          vpak.msg='console';
          //clog.LOGitem(clog.newitem({process:'CORE',msg:'Recieved Console Request'}));
          waiter=CONNECTconsole(req,res,vpak,logr);
          break;
        }
        case 'LOGIN':{ //'simple login'
          logr.info.cat="LOGIN";
          clog.LOGitem(clog.newitem({process:'CORE',msg:'Recieved Login Request'}));
          waiter=UserAccess(req,res,vpak,logr);
          break;
        }
        default:{//requesting resources
          logr.info.cat="FAIL";
          vpak.msg="Route not Found";
          clog.LOGitem(clog.newitem({process:'CORE',msg:'Not a route'}));
          res.write(JSON.stringify(vpak));
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
        rlog.LOGitem(logr);
        res.end();
        return resolve({res:res,pak:vpak});
      }
    }else{
      clog.LOGitem(clog.newitem({process:'CORE Process',msg:'Data Failed Authorization...'}));
      vpak.success=false;
      log.info.tracker.push(JSON.parse(JSON.stringify(vpak)));
      return resolve({res:res,pak:vpak})
    }
  });
}

var COREadmin=(req,res,vpak,log)=>{
  return new Promise((resolve,reject)=>{
    console.log('admin section>data> ',vpak.data)
    //clog.LOGitem(clog.newitem({process:'API',msg:'Data was Authorized...'}));
    vpak.success=true;
    log.info.access=vpak.data.access;
    log.info.tracker.push(JSON.parse(JSON.stringify(vpak)));
    vpak.msg='Check Access';
    var waiter = null;
    vapiuser.AUTHuser(vpak.data.access).then(
      auth=>{
        vpak.success=auth;
        vpak.msg = "User Authorized: " + auth;
        log.info.tracker.push(JSON.parse(JSON.stringify(vpak)));
        if(auth){
          log.info.tracker.push(JSON.parse(JSON.stringify(vpak)));
          switch(vpak.data.access.request.toUpperCase()){
            case 'USERS':{
              vpak.msg = 'edit users'
              switch(vpak.data.pack.method){
                case 'query':{
                  vapiuser.UPDATEuser(vpak.data.pack.options);
                  break;
                }
                case 'insert':{
                  vapiuser.INSERTuser(vpak.data.pack.options);
                  break;
                }
                case 'delete':{
                  vapiuser.DELETEuser(vpak.data.pack.options);
                  break;
                }
                case 'update':{
                  vapiuser.UPDATEuser(vpak.data.pack.options);
                  break;
                }
                default:{
                  vpak.msg="method not available";

                }
              }
              break;
            }
            case 'STORE':{
              waiter=vmart.ROUTEadmindatamart(vpak);
              break;
            }
            case 'JONAS':{
              waiter = japi.UPDATEfbook(vpak);
              break;
            }
            case 'COMPANY':{
              break;
            }
            default:{
              vpak.msg = "Setting not found";
            }
          }
          if(waiter){
            waiter.then(
              answr=>{
                log.info.tracker.push(JSON.parse(JSON.stringify(vpak)));
                res.write(JSON.stringify(vpak));
                return resolve({res:res,pak:vpak});
              }
            )
          }else{
            log.info.tracker.push(JSON.parse(JSON.stringify(vpak)));
            res.write(JSON.stringify(vpak));
            return resolve({res:res,pak:vpak});
          }
        }else{
          log.info.tracker.push(JSON.parse(JSON.stringify(vpak)));
          res.write(JSON.stringify(vpak));
          return resolve({res:res,pak:vpak});
        }
      }
    );
  });
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
var RouteVAPI = (res,vpak) =>{
  return new Promise((resolve,reject)=>{
    clog.LOGitem(clog.newitem({process:'API',msg:vpak}));
    switch(vpak.data.access.request.toUpperCase()){
      case 'PING':{return resolve({body:"...PING"});}
      case 'MART':{return resolve(VAPIrequester(res,vpak,{
        hostname:'127.0.0.1',
        port:'4000',
        path:'/',
        method:'PUT',
        header:{
          'Content-Type':'application/json'
        }
      }));}//case 'MART':{return resolve(vmart.ROUTEdatamart(vpak));}
      case 'JAPI':{return resolve(VAPIrequester(res,vpak,{
        port:'5050',
        path:'/',
        method:'PUT',
        header:{
          'Content-Type':'application/json'
        }
      }));}//case 'JAPI':{return resolve(japi.GETj2vtable(vpak,true));}
      default:{vpak.msg='API Command not Found';return resolve(false);}
    }
  });
}

var VAPIrequester=(res,vpak,{
  hostname:'127.0.0.1',
  port:'5000',
  path:'/',
  method:'GET',
  header:{
    'Content-Type':'application/json'
  }
})=>{ //used to request from another server
  return new Promise((resolve,reject)=>{
    console.log('Request ',vpak);
    const vres = http.request(options,(res)=>{
      let data='';
      console.log('Server has responded');
      res.on('data',chunk=>{data+=chunk;});
      res.on('end',()=>{
        console.log(data);
        try{data=JSON.parse(data);}catch{data={};}
      });
      return resolve(true);
    });
    vres.write(JSON.stringify(vpak));
    vres.end();
  });
}

var COREapi=(req,res,vpak,log)=>{
  return new Promise((resolve,reject)=>{
    console.log('api starting')
    clog.LOGitem(clog.newitem({process:'API',msg:'API starting...'}));
    /* AUTH request
       Need to ensure that before the request goes on, the data is checked for
       validity. If there is no data the request is likely a resource or page
       path, and not a request for data. Alternatively, the data contains
       expected values before continuing.
    */
    log.info.access=vpak.data.access;
    log.info.tracker.push(JSON.parse(JSON.stringify(vpak)));
    vpak.msg='Check Access';
    vapiuser.AUTHuser(vpak.data.access).then(//check user can access
      auth=>{
        vpak.success=auth;
        log.info.tracker.push(JSON.parse(JSON.stringify(vpak)));
        clog.LOGitem(clog.newitem({process:'API',msg:`User ${vpak.data.access.user} Authorization: ${auth}`}));
        if(auth){//user cleared
          vpak.msg='Fullfill Request'
          RouteVAPI(res,vpak).then(
            answr=>{
              //clog.LOGitem(clog.newitem({process:'API',msg:`Request for informaiton: ${answr}`}));
              vpak.success = answr;
              console.log(vpak);
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
  })
}



var CONNECTconsole=(req,res,vpak,log)=>{
  return new Promise((resolve,reject)=>{
    //clog.LOGitem(clog.newitem({process:'CONSOLE',msg:'Console...'}));
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
  })
}

var UserAccess=(req,res,vpak,log)=>{
  return new Promise((resolve,reject)=>{
    clog.LOGitem(clog.newitem({process:'LOGIN',msg:'User Login...'}));
    log.info.cat='LOGIN';
    vpak.success=true;
    log.info.tracker.push(JSON.parse(JSON.stringify(vpak)));
    vpak.msg='Auth user :'+'';
    //sort
    vapiuser.AUTHuser(vpak.data.access).then(
      auth=>{
        clog.LOGitem(clog.newitem({process:'LOGIN',msg:`User Authorization: ${auth}`}));
        vpak.success=auth;
        res.write(JSON.stringify(vpak));
        return resolve({res:res,pak:vpak});
      }
    );
  });
}

////////////////////////////////////////////////////////////////////////////////

var AUTHdata=(data)=>{
  if(data!=''&&data!=undefined){
    if(data.access!=undefined){
        //check packs based on request
        return true;
    }else{return false;}
  }else{return false;}
}

module.exports={
  COREproccess,
  SERVEresource,
  SETUPpaths,
  SETUPlogs,
  VAPIrequest
}

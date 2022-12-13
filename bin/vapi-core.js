
var path = require('path');
var url = require('url');
var fs = require('fs');
var {UStore} = require('./admin/vapi-user-store.js');
var {NEDBconnect} =require('./storage/nedb-connector.js');
var {Logger}=require('./vapi-logger.js');

var vapiresource = require('./resources/vapi-resources.js');
var vmart = require('./datamart/vapi-datamart.js');
var japi = require('./jmart/japimart.js');

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

var COREproccess=(req,res,vpak,logr)=>{
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
          waiter=COREapi(req,res,vpak,logr);
          break;
        }
        case 'ADMIN':{
          logr.info.cat="ADMIN";
          vpak.msg='requesting as administrator';
          console.log('requesting admin...')
          waiter=COREadmin(req,res,vpak,logr);
          break;
        }
        case 'CONSOLE':{
          logr.info.cat="CONSOLE";
          vpak.msg='console';
          //clog.LOGitem(clog.newitem({process:'CORE',msg:'Recieved Console Request'}));
          waiter=CONNECTconsole(req,res,vpak,logr);
          break;
        }
        case 'LOGIN':{
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
      case 'MART':{return resolve(vmart.ROUTEdatamart(vpak));}
      case 'JAPI':{return resolve(japi.GETj2vtable(vpak,true));}
      default:{vpak.msg='API Command not Found';return resolve(false);}
    }
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

var SERVEresource=(req,res,vpak,log)=>{
  return new Promise((resolve,reject)=>{
    clog.LOGitem(clog.newitem({process:'RESOURCE',msg:'Request from Public...'}));
    //log.info.cat="PUB";
    vpak.msg="Get Resource";
    vapiresource.servepublic(req.url,res).then(
      was=>{
        vpak.success=was;
        //log.info.tracker.push(JSON.parse(JSON.stringify(vpak)));
        clog.LOGitem(clog.newitem({process:'RESOURCE',msg:`Was found: ${was}`}));
        if(was){
          return resolve({res:res,pak:vpak});
        }
        else{
          clog.LOGitem(clog.newitem({process:'RESOURCE',msg:'Check for page'}));
          vapiresource.servecontrol(req.url,res).then(
            con=>{
              vpak.success=con.success;
              //log.info.tracker.push(JSON.parse(JSON.stringify(vpak)));
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
        //check packs based on request
        return true;
    }else{return false;}
  }else{return false;}
}

module.exports={
  COREproccess,
  SERVEresource,
  SETUPpaths,
  SETUPlogs
}

/* ADMIN Module
    Users:
    Apps:
    Tables/DB:
    Profiles:
*/
var path = require('path');
var {UStore} = require('./admin/vapi-user-store.js');
var {AdminStore}=require('./admin/vapi-admin-store.js');
var {AppStore}=require('./apps/vapi-app-store.js');
//vapiuser.INSERTdb(ustore.userjson);

/* Setup API appstores

  built to specifically setup the app store found on storemap. It would be
  smart to simplify the storemap to only include the apps and not drill down
  the way it is currently setup.
*/
var LOADstoremap = (storeroot,mappath='')=>{
  var storemap =null;
  var vapistore = {};
  try{storemap = require(mappath);}
  catch{return null}
  for(let store in storemap.store.apps){
    vapistore[store]=new AppStore(storeroot,store,storemap.store.apps[store]);
  }
  return vapistore;
}

var SETstoremap = (map)=>{
  if(map){

  }
}
/* ADMIN Router
   PASS:
   - task - USERS || APPS
   - ask - {}
*/

var storepath = path.join(__dirname,'store');


var ADMINrouter = (task,ask)=>{
  return new Promise((res,rej)=>{
    var {access,pack} = ask.data;
    ask.data=undefined; //clear data from pak
    switch(task){
    case 'STORE':{
      if(pack.method!=undefined&&pack.options!=undefined){
        var astore = AdminStore(storepath,access.app,vstors[access.app]);//create admin store
        var db = astore.CONNECTstore(pack.db);//attempt store connect
        if(db){ //confirm found databasae
          switch(pack.method){
            default:{ask.msg="Not a table command> "+pack.table.method;return res(ask);}
          }
        }else{console.log('ADMIN> no database')}
      }
    }
    case 'USERS':{
      if(pack.method!=undefined&&pack.options!=undefined){
        /*
        vapiuser.AUTHuser(access,true).then(
          auth=>{
            if(auth){
              let reciept = null;

              switch(pack.method){
                case 'query':{reciept = vapiuser.GETuser(pack.options);break;}
                case 'add':{reciept = vapiuser.ADDuser(pack.options);break;}
                case 'remove':{reciept = vapiuser.REMOVEuser(pack.options);break;}
                case 'update':{reciept = vapiuser.EDITuser(pack.options);break;}
                default:{ask.msg='Bad Method';return res(false);}
              }
              reciept.then(
                rcpt=>{
                  console.log(rcpt)
                  ask.body=rcpt;
                  return res(true);
                }
              )
            }else{ask.msg='User not Authorized';return res(false)}
          }
        )
        */
      }else{ask.msg='Pack bad format';return res(false)}
      break;
    }
    default:{ask.msg='Not an Admin command> '+task; return res(false);}
  }
  })
}

module.exports={
  LOADstoremap,
  ADMINrouter
}

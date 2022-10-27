
var {AppStore} = require('./apps/vapi-app-store.js');

var AppStoreRouter=(ask,apps={})=>{
  return new Promise((res,rej)=>{
    if(ask.data&&ask.data.access&&ask.data.pack!=undefined){//does contain correct data
      let {access,pack}=ask.data;
      ask.data = undefined;
      if(access.app!=undefined&&apps[access.app]!=undefined){ //check if app is registered
        if(pack.db!=undefined&&pack.method!=undefined&&pack.options!=undefined){//check for good pack
          apps[access.app].ACCESSstore(pack.db,pack.method,pack.options).then(
            reciept=>{console.log(reciept);ask.body=reciept;return res(true);}
          );
        }else{ask.msg='Incorrect pack';return res(false)}
      }else{ask.msg='App not registered';return res(false);}// app not registered
    }else{ask.msg='Incorrect data';return res(false);} //incorrect formating
  });
}

module.exports={
  AppStore,
  AppStoreRouter
}

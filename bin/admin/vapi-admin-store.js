var {NEDBconnect}=require('../storage/nedb-connector.js');
var {AppStore}=require('../apps/vapi-app-store.js');
/* Admin Store
    Class built to provide administration to App Stores
*/
class AdminStore{
  constructor(storeroot,storename,storemap){
    this.root=storeroot;
    this.store=storename;
    this.dbmap=storemap;
  }

  BACKUPstore=(ask,pack)=>{

  }
  SYNCstore=(ask,pack)=>{

  }
  //add application to store
  /* Add application to store
      PASS
      - pack:{
          method:'',
          app:'',
          options:{

          }
        }
  */
  ADDstore=(ask,pack)=>{
  }
  ADDtable=(ask,pack)=>{
  }
  //import tables into the node
  IMPORTtable=(ask,pack)=>{
  }

  //export tables out of the node
  EXPORTtable=(ask,pack)=>{
  }

}

module.exports={
  AdminStore
}

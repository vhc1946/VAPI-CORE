
var {UStore} = require('./vapi-user-store.js');
var {Logger}=require('../vapi-logger.js');

var vapiuser = new UStore(path.join(__dirname,'../store/admin/vapiusers.db'));

export var CONNECTconsole=(req,res,vpak,log)=>{
  return new Promise((resolve,reject)=>{
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
  });
}

module.exports={
  CONNECTconsole
}

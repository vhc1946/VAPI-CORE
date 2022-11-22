const path = require('path'),
      os = require('os');


/*User Information
    Collecting of user information to connect to
    required directories.
*/
var acomputeruser = (cu=null)=>{
    if(!cu||cu==undefined){
        cu = {};
    }
    return{
        uname: cu.uname || os.userInfo().username,
        spdrive: cu.spdrive || path.join(os.userInfo().homedir, '/vogelheating.com'),
        cdrive: cu.cdrive || 'C:/',
        ddrive:cu.ddrive || path.join(os.userInfo().homedir,'/Desktop')
    }
};

var aappuser = (au=null)=>{
    if(!au||au==undefined){au={};}
    return{
        uname: au.uname || '',
        pswrd: au.pswrd || '',
        config: au.config || null,
        cuser: acomputeruser(au.cuser)
    }
}

var acontact=(c=null)=>{
  if(!c||c==undefined){c={};}
  return{
    name:c.name||'',
    phone:c.phone||'',
    email:c.email||'',

  }
}

var asystemuser=(su=null)=>{
  if(!su||su==undefined){su={};}
  return{
    user:su.user||'',
    pswrd:su.pswrd||'',
    contact:acontact(su.contact),
    apps:su.apps||[]
  }
}
module.exports = {
    acomputeruser,
    aappuser
}

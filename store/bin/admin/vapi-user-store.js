var {NEDBconnect}=require('../storage/nedb-connector.js');
class UStore extends NEDBconnect{
  constructor(udocs){
    super({filename:udocs,autoload:true},{fieldName: 'user',unique: true,sparse:true}); //connect to db file
  }

  /* Authorize a user
      This method is built to check the user list for a user as well as
      check if the user is an administrator
      PASS:
      - access:{coid,app,user,pswrd} //only use user & pswrd
      - admin:TRUE(check for admin) || FALSE(do not check)
  */
  AUTHuser = (access,admin=false)=>{
    return new Promise((res,rej)=>{
      this.docs.loadDatabase();
      if(access.user&&access.pswrd){ //check for user&pswrd var
        this.QUERYdb({user:access.user}).then(//search for user
          doc=>{
            if(doc&&doc.length>0){//if user was found
              if(doc[0].pswrd==access.pswrd){
                if(admin){
                  if(doc[0].admin){return res(true);}
                  else{return res(false);}
                }else{return res(true);}
              }//pswrd confirmed
              else{return res(false)}//pswrd denied
            }else{return res(false)}//user not found
          }
        );
      }else{return res(false)}//user||pswrd not defined
    });
  }

  GETuser = (opts)=>{
    return new Promise((res,rej)=>{
      if(!opts.query){return res({docs:[],err:'bad options'})}
      return res(this.QUERYdb(opts.query));
    });
  }
  ADDuser = (opts)=>{
    return new Promise((res,rej)=>{
      if(!opts.docs){return res({doc:[],err:'bad options'});}
      return res(this.INSERTdb(opts.docs));
    });
  }
  REMOVEuser = (opts)=>{
    return new Promise((res,rej)=>{
      if(!opts.query){return res({num:0,err:'bad options'});}
      if(!opts.multi){opts.multi=true;}
      return res(this.REMOVEdoc(opts.query,opts.multi));
    });
  }
  EDITuser = (opts)=>{
    return new Promise((res,rej)=>{
      if(!opts.query||!opts.update||!opts.options){return res({numrep:0,err:'bad options'});}
      return res(this.UPDATEdb(opts.query,opts.update,opts.options));
    });
  }
}
module.exports={
  UStore
}

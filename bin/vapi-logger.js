
var path=require('path');
var DataStore = require('nedb');
var {NEDBconnect} =require('./storage/nedb-connector.js');

var logfiles = {
  error:{
    file:'errorlogs.db',
    info:(el)=>{
      if(!el||el==undefined){el={}}
      return {
        err:el.err||'',
        msg:el.msg||'EMPTY'
      }
    }
  },
  request:{
    file:'requestlogs.db',
    info:(rl)=>{
      if(!rl||rl==undefined){rl={};}
      return {
        url:rl.url||null,
        cip:rl.cip||null,

        access:rl.access||{user:'',pswrd:'',coid:'',appid:''},

        tracker:rl.tracker||[],
        pack:rl.pack||{},
        success:rl.success||false
      }
    }
  },
  console:{
    file:'consolelogs.db',
    info:(cl)=>{
      if(!cl||cl==undefined){cl={};}
      return{
        header:cl.header||'HEAD',
        program:cl.program||'GENERAL',
        msg:cl.msg||'EMPTY'
      }
    }
  },
  tracking:{
    file:'processlogs.db',
    info:(tl)=>{return{}}
  }
}

class Logger extends NEDBconnect{
  constructor(process,type,docs){
    super(path.join(docs,logfiles[type].file));
    this.type=type;
    this.info=logfiles[type].info;

    console.log(this.info())
  }

  newitem(it){
    if(!it||it==undefined){it={}}
    return{
      timein:new Date().getTime(),
      timeout:null,
      timeout:null,
      program:it.program || 'VAPI',
      process:it.process || '',
      type:it.type||'General',
      msg:it.msg||'New Item',
      info:this.info(it.info)||{}
    }
  }

  LOGitem=(item)=>{
    item.timeout = new Date().getTime();
    item.timerun = item.timeout - item.timein;
    item.timeout = new Date().getTime();
    this.INSERTdb(item)
  }
}

module.exports={Logger}

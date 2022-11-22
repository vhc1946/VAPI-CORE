var acomputer=(c=null)=>{
  if(!c||c==undefined){c={};}
  return{
    id:c.id||'',
    status:c.status||'',
    user:c.user||'',
    make:c.make||'',
    model:c.model||''
  }
}

module.exports={
  acomputer
}

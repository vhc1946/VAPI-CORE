var aphone=(p=null)=>{
  if(!p||p==undefined){p={};}
  return{
    plan:p.plan||'',
    user:p.user||'',
    name:p.name||'',
    model:p.model||'',
    upgrade:p.upgrade||'', //date
  }
}
module.exports={
  aphone
}

var acompany=(c=null)=>{
  if(!c||c==undefined){c={};}
  return{
    id:c.id||'',
    name:c.name||'',
    depts:c.depts||[],
    owners:c.owners||[]
  }
}

module.exports={
  acompany
}

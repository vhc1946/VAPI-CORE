
var vapiurl = 'https://18.191.134.244:5000/'

export var SENDrequest = (pack,url=vapiurl)=>{
  return new Promise((res,rej)=>{
    var options={
      method:'POST',
      headers:{
        'Accept':'application/json'
      },
      body:JSON.stringify({
        access:{
          user:'VOGCH',
          pswrd:'vogel123',
          coid:'01',
          request:'mart'
        },
        pack:pack
      })
    }
    fetch(url,options)
    .then(response=>{return response.json()})
    .then(data=>{return res(data);})
    .catch(err=>{console.log(err);})
  });
}

export var SENDrequestapi = (pack,request='mart',url=vapiurl+'api/')=>{
  return new Promise((res,rej)=>{
    var options={
      method:'POST',
      headers:{
        'Accept':'application/json'
      },
      body:JSON.stringify({
        access:{
          user:'VOGCH',
          pswrd:'vogel123',
          coid:'01',
          request:request
        },
        pack:pack
      })
    }
    fetch(url,options)
    .then(response=>{return response.json()})
    .then(data=>{return res(data);})
    .catch(err=>{console.log(err);})
  });
}

export var SENDrequestadmin = (pack,request='store',url=vapiurl+'admin/')=>{
  return new Promise((res,rej)=>{
    var options={
      method:'POST',
      headers:{
        'Accept':'application/json'
      },
      body:JSON.stringify({
        access:{
          user:'VOGCH',
          pswrd:'vogel123',
          coid:'01',
          request:request
        },
        pack:pack
      })
    }
    fetch(url,options)
    .then(response=>{return response.json()})
    .then(data=>{return res(data);})
    .catch(err=>{console.log(err);})
  });
}

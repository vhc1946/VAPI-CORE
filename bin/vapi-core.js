
var path = require('path');
var fs = require('fs');
var {UStore} = require('./admin/vapi-user-store.js');
var vapiuser = new UStore(path.join(__dirname,'../store/admin/vapiusers.db'));


var midware = {
  controls:null,
  public:null,
  setupmid:(control,public)=>{
    this.controls=control || null;
    this.public=public || null;
  }
}

var servebin = (url,res,bin='./gui/')=>{
  return new Promise((resolve,reject)=>{
    var contype = '';

    if(url.match('\.js$')){contype='text/javascript';}
    else if(url.match('\.css$')){contype='text/css';}
    else if(url.match('\.png$')){contype='image/png';}
    else{return resolve(false);}

    fs.readFile(path.join(__dirname, bin, url),(err,con)=>{
      if(!err){
        res.setHeader('X-Content-Type-Options','nosniff');
        res.writeHead(200, {"Content-Type": contype});
        res.end(con);
        return resolve(true);
      }else{
        res.writeHead(404);
        res.end();
        return resolve(true);
      }
    });
  });
}

var servecontrol = (url="",res=null,control='../controllers')=>{
  return new Promise((resolve,reject)=>{
    if(res){
      console.log('URL',url)
      fs.stat(`${path.join(__dirname,control,url)}.html`,(err,stat)=>{
        if(err){
          fs.readFile(path.join(__dirname,control,'vapi.html'),(err,doc)=>{
            if(err){//send to landingd?
              console.log(err)
              res.writeHead(500);
              res.end();
              return resolve({success:true,msg:'Bad Page'});
            }else{//load requested page
              res.writeHead(200,{'Content-Type':'text/html'});
              res.end(doc);
              return resolve({success:true,msg:'Good Page'});
            }
          });
        }
        else{
          fs.readFile(`${path.join(__dirname,control,url)}.html`,(err,doc)=>{
            if(err){//send to landingd?
              console.log(err)
              res.writeHead(500);
              res.end();
              return resolve({success:true,msg:'Bad Page'});
            }else{//load requested page
              res.writeHead(200,{'Content-Type':'text/html'});
              res.end(doc,'utf-8');
              return resolve({success:true,msg:'Good Page'});
            }
          });
        }
      });
    }else{return resolve({success:false,msg:'No Response Object'});}
  });
}

var corecall=(req,res,router=false)=>{
  return new Promise((resolve,reject)=>{
    let data=''; //to accept data
    req.on('data',chunk=>{data+=chunk;});
    req.on('end',()=>{
      try{data=JSON.parse(data);}catch{data={}}

      if(data!=''&&data.access!=undefined){ //check if data is formated
        let rspak={ //prep vapi response pack object
          msg:'Could not log in..',
          success:false,
          body:{},
          data:data
        }
        vapiuser.AUTHuser(data.access).then(//check user can access
          auth=>{
            if(auth){//user cleared
              rspak.success=true;
              rspak.msg='Has Logged in'
              reqlog.success=true; //update request log item
              if(!router){ //check for a routing function
                router(req.url.split('/'),res,rspak).then(
                  answr=>{
                    rspak.success = answr;
                    res.write(JSON.stringify(rspak)); //write the result to the response
                    res.end();
                    return resolve({success:true,msg:'Responded'});
                  }
                )
              }else{return resolve({success:false,msg:'No Router'});}
            }else{
              res.write(JSON.stringify(rspak)); //write the result to the response
              res.end(); //end the request
              return resolve({success:false,msg:'Not signed in'});
            }
          }
        );
      }else{ //landing page
        servebin(req.url,res).then(
          was=>{
            if(was){return resolve(true);}
            else{return resolve(servecontrol(req.url,res))}
          }
        )
      }
    });
  });
}

module.exports={
  corecall,
  servebin,
  servecontrol,
  midware
}

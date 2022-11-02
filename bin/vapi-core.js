
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

var servebin = (req,res,bin='/bin/gui/')=>{
    var contype = '';

    if(req.url.match('\.js$')){contype='text/javascript';}
    else if(req.url.match('\.css$')){contype='text/css';}
    else if(req.url.match('\.png$')){contype='image/png';}
    else{return false;}

    var stream = fs.createReadStream(path.join(__dirname,bin,req.url));

        stream.on('error', function(error) {
            res.writeHead(404, 'Not Found');
            res.end();
        });

        stream.pipe(res);
    /*
    var file = fs.readFile(path.join(__dirname, bin, req.url),(err,con)=>{
      res.writeHead(200, {"Content-Type": contype});
      res.end(con);
    });
    */
  }

var servecontrol = (url="",res=null,control='../controllers')=>{
  console.log(control)
  return new Promise((resolve,reject)=>{
    console.log('RES',res);
    console.log(path.join(__dirname,control,url));
    if(res){
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
              res.end(doc,'utf-8');
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
              if(router){ //check for a routing function
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
              return resolve({success:false,msg:'No Router'});
            }
          }
        );
      }else{ //landing page
        return resolve(servecontrol(req.url,res));
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

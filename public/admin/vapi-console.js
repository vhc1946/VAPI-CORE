import * as Titlebar from '../repo/js/modules/vg-titlebar.js';
import {ViewGroup} from '../repo/js/modules/view-controller.js';

var qactions={
}
var mactions={
  reportconsole:{
    id:'console-report',
    src:'assets/icons/bar-chart-icon.png'
  },
  filterconsole:{
    id:'console-report',
    src:'assets/icons/filter-icon.png'
  },
  connectconsole:{
    id:'console-connect',
    src:'assets/icons/power-icon.png',
    title:'Not Connected'
  }
}

var login = Titlebar.SETUPtitlebar(qactions,mactions);

var testjapi=(url,data)=>{
  return new Promise((resolve,reject)=>{
    var options={
      method:'POST',
      headers:{
        'Accept':'application/json'
      },
      body:JSON.stringify(data)
    }
    fetch(url,options)
    .then(response=>{console.log(response);return response.json()})
    .then(data=>{return resolve(data);})
    .catch(err=>{console.log(err);})
  });
}

var conurl='/console';//'https://localhost:5000/console';
class ConsoleLog{
  constructor(view,log=null){
    this.console=document.createElement('div');
    this.console.classList.add('console-view');

    this.stopped=false;

    view.appendChild(this.console);
    if(log){this.session.log.name=log;}
  }

  session={
    starttime:new Date().getTime(),
    access:JSON.parse(localStorage.getItem('vapi-user'))||{user:'VOGCH',pswrd:'vogel321'},
    connected:false,
    method:'login',
    msg:'...Start up',
    log:{
      name:'',
      rangestart:new Date().getTime(),
      rangeend:new Date().getTime()
      }
    }

  requestchunk(){
    return new Promise((resolve,reject)=>{
      var options={
        method:'POST',
        headers:{
          'Accept':'application/json'
        },
        body:JSON.stringify(this.session)
      }
      fetch(conurl,options)
      .then(response=>{return response.json()})
      .then(data=>{
        console.log(data);
        this.session=data.data;
        return resolve(data.body);
      })
      .catch(err=>{console.log(err);})
    });
  }

  connectsession(){
    setTimeout(()=>{
      this.requestchunk().then(
        logs=>{
          if(this.session.connected){
            if(logs.length>0){
              try{
                this.console.children[0].classList.add('console-chunk');
              }catch{}
              try{this.console.children[0].classList.remove('console-chunk-last');}catch{}
              this.console.prepend(WRITEtoconsole(logs));
            }
            this.connectsession();
          }else{
            try{this.console.children[0].classList.remove('console-chunk-last');}catch{}
            this.console.prepend(document.createElement('div'));
            this.console.children[0].innerHTML='<div class="session-stop-block">...Disconnected</div>';
          }
        }
      )
    },2000);
  }

  startsession(creds=null){
    return new Promise((resolve,reject)=>{

      let running=false;
      this.session.method='login';
      this.console.prepend(document.createElement('div'))
      this.console.children[0].innerHTML='<div class="session-start-block">Starting....</div>';
      if(creds){
        for(let c in creds){this.session.access[c]=creds[c];}
        this.requestchunk().then(
          login=>{
            if(this.session.connected){this.connectsession();return resolve(true);}
            return resolve(false);
          }
        )
      }else{return resolve(false);}
    })
  }

  stopsession(){this.stopped=true;this.session.connected=false;}
}

// Setup Console View //////////////////////////////////////////////////////////
let vapiconsole=document.getElementById('console-container');
let consoleview=new ViewGroup({
  cont:vapiconsole,
  type:'mrt',
  swtchEve:(title)=>{
    if(consoles[title]){
      try{currcon.stopsession();}
      catch{}
      currcon=consoles[title];
      if(currcon.stopped){document.getElementById(mactions['connectconsole'].id).title='Not Connected'}
      else{document.getElementById(mactions['connectconsole'].id).title='Connected'}
    }
  }
});
document.body.appendChild(vapiconsole);
////////////////////////////////////////////////////////////////////////////////

// Console Actions /////////////////////////////////////////////////////////////
document.getElementById(mactions.connectconsole.id).addEventListener('click',(ele)=>{
  if(currcon){
    if(currcon.stopped){currcon.stopped=false;document.getElementById(mactions['connectconsole'].id).title='Connected'}
    else{document.getElementById(mactions['connectconsole'].id).title='Not Connected';currcon.stopsession();}
  }
});
document.getElementById(mactions.filterconsole.id).addEventListener('click',(ele)=>{

});
document.getElementById(mactions.reportconsole.id).addEventListener('click',(ele)=>{

});
////////////////////////////////////////////////////////////////////////////////

var consoles = {
  request:null,
  error:null,
  console:null
};
for(let c in consoles){
  let view = document.createElement('div');
  consoles[c] = new ConsoleLog(view,c);
  consoleview.ADDview(c,view);
}

var currcon = consoles.console;

var runapp = ()=>{
  setTimeout(()=>{
    if(login.permission && currcon && !currcon.stopped && !currcon.session.connected){//turn on
      console.log('Have Access...');
      console.log('start session')
      currcon.startsession(login.storecreds).then(
        started=>{runapp();}
      );
    }else if(!login.permission && currcon && currcon.session.connected){
      console.log('Do Not Have Access...');
      for(let cons in consoles){consoles[cons].stopsession();}
      runapp();
    }else{
      runapp();
    }
  },500);
}

runapp();


var LOGrequesttracker=(tracker)=>{
  let list='';
  if(tracker){
    list='<div>---MESSAGE-----------------------------SUCCESS--</div>'
    for(let x=tracker.length-1;x>=0;x--){
      list+=
      `<div>
        <div>${tracker[x].msg}</div>
        <div>${tracker[x].success}</div>
      </div>`
    }
  }
  return list
}
var LOGrequesttimeinout=(dat)=>{
  return`Date: ${dat.getFullYear()}/${dat.getMonth()}/${dat.getDate()} Time: ${dat.getHours()}:${dat.getMinutes()}:${dat.getSeconds()}`
}
var LOGrequest=(ri)=>{
  return`
    <div class="console-log">
      <div class="console-input">
        <div>Program</div>
        <div>${ri.program||''}</div>
      </div>
      <div class="console-input">
        <div>Process</div>
        <div>${ri.process||''}</div>
      </div>
      <hr>
      <div class="console-input">
        <div>Request</div>
        <div>${ri.info.url}</div>
      </div>
      <div class="console-input">
        <div>Requester</div>
        <div>${ri.info.cip}</div>
      </div>
      <div class="console-input"><div>Category</div><div>${ri.info.cat}</div></div>
      <hr>
      <p>Message: ${ri.msg}</p>
      <hr>
      <div class="console-input"><div>Time</div><div>${LOGrequesttimeinout(new Date(ri.timein))}</div></div>
      <div class="console-input"><div>Time out</div><div>${LOGrequesttimeinout(new Date(ri.timeout))}</div></div>
      <div class="console-input"><div>Time run</div><div>${ri.timerun} milliseconds</div></div>
      <hr>
      <div>--------------------------TRACKING----------------------</div>
      <div class="console-request-tracker">${LOGrequesttracker(ri.info.tracker)}</div>
    </div>
  `
}
var WRITEtoconsole=(list)=>{
  let chunck = document.createElement('div');

  for(let x=0;x<list.length;x++){
    chunck.innerHTML+=LOGrequest(list[x]);
    //add event to chunk
  }
  chunck.classList.add('console-chunk-last');
  return chunck;
}

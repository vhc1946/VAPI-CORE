import * as vapi from '../../repo/apis/vapi.js';
import {ViewGroup} from '../../repo/js/modules/view-controller.js';

var ssdom = {
  cont:'',
  store:''
}

var WRITEdatabaseensure=(ensure={})=>{
  let contents='';
  for(let e in ensure){contents+=`<div><div>${e}</div><div>${ensure[e]}</div></div>`}
  return contents;
}
var WRITEdatabasemap=(map={})=>{
  let contents='';
  for(let m in map){contents+=`<div><div>${m}</div><div>${map[m]}</div></div>`}
  return contents;
}
var ADDdatabase=(db,info={})=>{
  let dbele = document.createElement('div');
  dbele.classList.add('db-cont');
  dbele.innerHTML=`
    <div>${db}</div>
    <div class="db-file-block"><div>Filename</div><div>${info.filename||''}</div></div>
    <div class="db-ensure-block"><div>Ensure</div><div>${WRITEdatabaseensure(info.ensure||undefined)}</div></div>
    <div class="db-map-block"><div>Map</div><div>${WRITEdatabasemap(info.map||undefined)}</div></div>
  `
  return dbele;
}

export var SETUPstorelist=(cont)=>{
  return new Promise((resolve,reject)=>{
    vapi.SENDrequestadmin({
      method:'collectionmaps'
    },'store').then(
      answr=>{
        console.log(answr);
        let collectview = new ViewGroup({
          cont:cont,
          type:'mtc'
        });
        if(answr.body.result){
          let collects = answr.body.result;
          for(let c in collects){
            let view = collectview.ADDview(c,document.createElement('div'));
            view.classList.add('collection-cont');
            let storeview = new ViewGroup({
              cont:view,
              type:'mrt'
            });
            for(let s in collects[c].stores){
              let storeele = document.createElement('div');
              storeele.classList.add('store-cont');
              storeview.ADDview(s,storeele);
              for(let db in collects[c].stores[s]){
                storeele.appendChild(ADDdatabase(db,collects[c].stores[s][db]));
              }
            }
          }
        }else{console.log('no maps')}

      }
    );
  })
}

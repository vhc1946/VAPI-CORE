//users
//store
//jonas

import * as Titlebar from '../repo/js/modules/vg-titlebar.js';
import {ViewGroup} from '../repo/js/modules/view-controller.js';
import * as vapi from '../repo/apis/vapi.js';
import {UserForm} from './forms/user-settings.js';
import * as storesetts from './forms/store-settings.js';

var qactions={

}
var mactions={
  testbutton:{
    id:'api-test-button',
    src:'/~assets/icons/question.png'
  },
  companysettings:{
    id:'settings-button-company',
    src:'/~assets/icons/bar-chart-icon.png'
  },
  usersettings:{
    id:'settings-button-users',
    src:'/~assets/icons/usersettings.png'
  },
  storesettings:{
    id:'settings-button-store',
    src:'/~assets/icons/databasesettings.png'
  },
  jonassettings:{
    id:'settings-button-jonas',
    alt:'J',
    title:'Not Connected'
  }
}


var login = Titlebar.SETUPtitlebar(qactions,mactions,false);

document.getElementById(mactions.testbutton.id).addEventListener('click',(ele)=>{
  vapi.SENDrequestadmin({
    collect:'settsss',
    store:'apps',
    db:'userdescr',
    method:'adddatabase',
    options:{

    }
  },'store').then(answr=>{console.log(answr)});
});

vapi.SENDrequestapi({
  collect:'settsss',
  store:'apps',
  db:'userdescr',
  method:'insert',
  options:{
    docs:{id:'that',name:'those'}
  }
}).then(answr=>{console.log(answr)});

var settngcont = document.getElementById('settings-container');

var settingviews = {
  companies:document.getElementById('setting-view-companies'),
  users:document.getElementById('setting-view-users'),
  jonas:document.getElementById('setting-view-jonas'),
  stores:document.getElementById('setting-view-stores')
}

var settingbuttons = {
  companies:document.getElementById(mactions.companysettings.id),
  users:document.getElementById(mactions.usersettings.id),
  jonas:document.getElementById(mactions.jonassettings.id),
  stores:document.getElementById(mactions.storesettings.id)
}

var SWITCHview=(views,view=null)=>{
  let selectview = 'loose-view-selected';
  for(let v in views){
    if(views[v].classList.contains(selectview)){views[v].classList.remove(selectview);}
  }
  if(view){view.classList.add(selectview)}
}
var SETUPviews=(buttons,views)=>{
  for(let b in buttons){
    buttons[b].addEventListener('click',(ele)=>{SWITCHview(views,views[b]);});
  }
}

SETUPviews(settingbuttons,settingviews);

var userform = new UserForm(settingviews.users);
storesetts.SETUPstorelist(settingviews.stores)

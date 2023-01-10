//users
//store
//jonas

import * as Titlebar from '../repo/js/modules/vg-titlebar.js';
import {ViewGroup} from '../repo/js/modules/view-controller.js';
import * as vapi from '../repo/apis/vapi.js';

var qactions={

}
var mactions={
  service:{
    id:'api-test-button',
    src:'/~assets/icons/question.png',
    title:'SERVICE TEST',
    onclick:(ele)=>{
      console.log('NOT Connected');
    }
  },
  store:{
    id:'settings-button-company',
    src:'/~assets/icons/bar-chart-icon.png',
    title:'STORE TEST',
    onclick:(ele)=>{
      vapi.SENDrequestapi({pack:{}},'mart').then(
        answr=>{console.log(answr);}
      )
    }
  },
  japi:{
    id:'settings-button-users',
    src:'/~assets/icons/usersettings.png',
    title:'JAPI TEST',
    onclick:(ele)=>{
      vapi.SENDrequestapi({pack:{}},'japi').then(
        answr=>{console.log(answr);}
      )
    }
  },
}


/*  Currently Developing

  Dividing up vapi into seperate servers. Servers are listed below, and there test
  under that. Once basic connections are established and basic tasks routed, the
  system can be placed in application for further testing.

  PHASE 1: use local host to move files seperate servers and connect them through
  vapi.

  PHASE 2: create an necesary ec2 instances, and start each server. test connection
  through this page.

  PHASE 3: Review / Refract code base, test in ec2.

  - JAPI -
   1. ping
   2. query tables
   3. sync -> VMART

  - VMART -
   1. ping
   2. query tables
   3. sync <- JAPI
   4. sync -> client

   - VSERVICE -
    1. ping
    2. launch apps
    3, run app related task
    3. reporting
    4. weather
    3. sync apps manage lists
*/

var login = Titlebar.SETUPtitlebar(qactions,mactions,false);

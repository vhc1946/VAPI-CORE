
import {CreateComponent} from '../tools/vhc-components.js';

//  PATHS //
var stylesheets = ['repo/css/modules/vg-titlebar.css','repo/css/modules/vg-login.css'];

var tbdom={ // Titlebar
  cont:'titlebar-cont',
  title:'titlebar-title',
  window:{
    close:'titlebar-win-close',
    mini:'titlebar-win-mini',
    maxi:'titlebar-win-maxi'
  },
  more:{
    cont:'titlebar-moretools',
    actions:'titlebar-moretools-quick'
  },
  info:{
    cont:'titlebar-page-user-cont',
    username:'titlebar-username'
  },
  login:{
    cont:'loginout-block',
    form:'loginout-form',
    uname:'loginout-uname',
    pswrd:'loginout-pswrd',
    submit:'loginout-submit',
    help:'loginout-help'
  },
  page:{
    save:'titlebar-page-save',
    print:'titlebar-page-print',
    settings:'titlebar-page-settings',
    user:'titlebar-page-user'
  },
  utils:{
    buttons:{
      view:'titlbar-button-view',
      action:'titlebar-button-action',
      moretools:'titlebar-button-more',
      help:'titlebar-button-help'
    },
    groups:{
      right:'titlebar-cont-right',
      left:'titlebar-cont-left'
    }
  }
}

class VHCform{
  constructor(cont){
    this.cont=cont;
    this.inputs={};
  }

  set form(input){
    for(let i in this.inputs){
      this.inputs[i].value = input[i]?input[i]:'';
    }
  }
  get form(){
    let fi ={}
    for(let i in this.inputs){
      fi[i]=this.inputs[i].value;
    }
    return fi;
  }


  switch(){}
  validate(){}
  submit(){}
}

var ldom={
  cont:'login-box',
  info:'login-info',
  inputs:{
    user:'login-username',
    pswrd:'login-password'
  },
  actions:{
    submit:'login-submit'
  }
}
class LoginForm extends VHCform{
  constructor(cont){
    super(cont);
    this.cont.innerHTML=
    `
    <div id=${ldom.cont}>
      <div id=${ldom.info}>
          <label>User</label><input id=${ldom.inputs.user} type="text"/>
          <label>Password</label><input id=${ldom.inputs.pswrd} type="password"/>
          <div id=${ldom.actions.submit} class="flat-action-button">SUBMIT</div>
      </div>
    </div>
    `

    this.inputs.user=document.getElementById(ldom.inputs.user);
    this.inputs.pswrd=document.getElementById(ldom.inputs.pswrd);
    console.log(this.inputs)

    this.permission=false;

    let creds=this.storecreds;
    console.log(creds);
    if(creds && creds.user!=''||creds.pswrd!=''){
      this.form=creds;
      this.submit().then(
        result=>{
          if(result.success){
            this.permission=true;
            $(this.cont).hide();
          }
          else{this.form=undefined;}//reset form
          this.storecreds=this.form;//store result
        }
      )
    }else{this.storecreds=undefined}

    document.getElementById(ldom.actions.submit).addEventListener("click",(ele)=>{
      this.submit().then(
        result=>{
          if(result.success){
            //DropNote('tr','Logged in','green');
            this.permission=true;
            $(this.cont).hide();
          }else{//login failed
            //DropNote('tr','User or Password Failed','yellow');
            this.permission=false;
            this.form={user:"",pswrd:""};//reset form
          }
          this.storecreds=this.form;//reset store
        }
      )
    });
    for(let i in this.inputs){
      this.inputs[i].addEventListener('keypress',(eve)=>{
        if(eve.key == 'Enter'){document.getElementById(ldom.actions.submit).click();};
      });
    }
  }

  get storecreds(){
    try{
      let creds=JSON.parse(localStorage.getItem('vapi-user'));
      if(creds){return creds;}
      else{return {user:'',pswrd:''};}
    }catch{return {user:'',pswrd:''};}
  }
  set storecreds(creds={user:'',pswrd:''}){localStorage.setItem('vapi-user',JSON.stringify(creds))}

  validate(){
    let frm = this.form;
    if(frm.user!=''||frm.pswrd!=''){return true;}
    else{return false;}
  }
  submit(){
    return new Promise((resolve,reject)=>{
      let {user,pswrd} = this.form;
      if(user!=''||pswrd!=''){
        var options={
          method:'POST',
          headers:{
            'Accept':'application/json'
          },
          body:JSON.stringify({access:{user:user,pswrd:pswrd}})
        }
        fetch('/login',options)
          .then(response=>{return response.json()})
          .then(data=>{return resolve(data);})
          .catch(err=>{console.log(err);})
      }else{return resolve({success:false});}
    });
  }
}

var tdom = ()=>{
  return{
    [`#${tbdom.cont}.div`]:{
      attributes:{},
      children:{
        [`#${tbdom.utils.groups.left}.div`]:{
          attributes:{},
          children:{
            [`#${tbdom.more.cont}.img`]:{
              attributes:{
                class: "titlebar-button-action",
                src: "assets/icons/menu-burger.png",
                alt: "MORE",
                title: "More"
              },
              children: null
            },
            [`#${tbdom.more.actions}.div`]:{
              attributes:{
                style: "display:none"
              },
              children:null
            }
          }
        },
        [`#${tbdom.title}.div`]:{
          attributes:{
          },
          children:null
        },
        [`#${tbdom.utils.groups.right}.div`]:{
          attributes:{},
          children:{
          [`#${tbdom.info.cont}.span`]:{
            attributes:{},
            children:{
              [`#${tbdom.page.user}.img`]:{
                attributes:{
                  class: "titlebar-button-action",
                  src: "assets/icons/user.png",
                  alt: "USER",
                  title: "Log Out"
                },
                children: null
              },
              [`#${tbdom.info.username}.span`]:{
                attributes:{},
                children:null
              }
            }
          },
          [`#${tbdom.login.cont}.div`]:{
            attributes:{},
            children:null
          },
            [`#${tbdom.utils.buttons.help}.img`]:{
              attributes:{
                class: "titlebar-button-action",
                src: "assets/icons/info.png",
                alt: "HELP",
                title: "help"
              },
              children: null
            }
          }
        }
      }
    }
  }
}

var ADDstylesheets=(styles=[])=>{
  for(let x=0,l=styles.length;x<l;x++){
    let viewstyles = document.createElement('link');
    viewstyles.setAttribute('rel','stylesheet');
    viewstyles.setAttribute('href',styles[x]);
    document.getElementsByTagName('head')[0].prepend(viewstyles);
  }
}

/* ADD actions to title bar
    Function to add an array of elements to the more actions portion
    of the title bar.
*/
var ADDmactions=(acts)=>{
  acts=CREATEactionbuttons(acts);
  for(let x=0;x<acts.length;x++){
    document.getElementById(tbdom.more.actions).appendChild(acts[x]);
  }
}

var ADDqactions=(acts)=>{
  acts=CREATEactionbuttons(acts);
  for(let x=0;x<acts.length;x++){
    document.getElementById(tbdom.utils.groups.left).insertBefore(acts[x],document.getElementById(tbdom.info.cont)); //refresh button
  }
}

var CREATEactionbuttons=(acts)=>{
  let alist = [];
  for(let ma in acts){
    alist.push(document.createElement('img'));
    if(ma.includes('spacer')){
      acts[ma]={src:'./bin/repo/assets/icons/minus.png',title: ''}
      alist[alist.length-1].classList.add('moretools-spacer');
    }
    alist[alist.length-1].classList.add(tbdom.utils.buttons.action);
    for(let as in acts[ma]){
      alist[alist.length-1][as]=acts[ma][as];
    }
  }
  return alist;
}

var SETUPtitlebar=(qacts={},macts={},login=true)=>{
  document.body.prepend(CreateComponent(tdom())); //add titlebar to the body
  ADDstylesheets(stylesheets);
  ADDqactions(qacts);
  ADDmactions(macts);

  document.getElementById(tbdom.more.cont).addEventListener('click',(ele)=>{  // Toggle More Options menu
    let moreele = document.getElementById(tbdom.more.actions);
    $(moreele).toggle();
  });

  if(login){
    document.getElementById(tbdom.page.user).addEventListener('click',(ele)=>{
      if($(document.getElementById(tbdom.login.cont)).is(":visible")){
        $(document.getElementById(tbdom.login.cont)).hide();
      }else{$(document.getElementById(tbdom.login.cont)).show()}
    });
    return new LoginForm(document.getElementById(tbdom.login.cont));}
  else{return null;}
}


export {
  tbdom,
  SETUPtitlebar
}

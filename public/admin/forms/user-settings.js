import * as vapi from '../../repo/apis/vapi.js';
import {VHCform} from '../../repo/js/tools/vhc-forms.js';

export class UserForm extends VHCform{
  constructor(cont){
    super(cont);

    this.cont.innerHTML=this.content;

    this.setinputs(this.ufdom.inputs);

    this.cont.getElementsByClassName(this.ufdom.actions.submit)[0].addEventListener('click',(ele)=>{
      this.submit().then(
        was=>{
          console.log(was);
        }
      )
    });
  }

  ufdom = {
    cont:'user-edit-form',
    inputs:{
      user:'form-edit-user',
      pswrd:'form-edit-pswrd',
      group:'form-edit-group',
      fname:'form-edit-fname',
      lname:'form-edit-lname',
      phone:'form-edit-phone',
      email:'form-edit-email',
      company:'form-edit-company',
      joined:'form-edit-joined',
      title:'form-edit-title',
      dept:'form-edit-dept',
      repto:'form-edit-repto',
      jdescr:'form-edit-jdescr',
      photo:'form-edit-photo'
    },
    actions:{
      submit:'form-edit-submit'
    }
  };

  content =`
  <div class="${this.ufdom.cont}">
    <div class="form-edit-actions">
      <div class="${this.ufdom.actions.submit}">SUBMIT</div>
    </div>
    <div><div>User</div><input class="${this.ufdom.inputs.user}"/></div>
    <div><div>Password</div><input class="${this.ufdom.inputs.pswrd}" type="password"/></div>
    <div><div>Group (permissions)</div><input class="${this.ufdom.inputs.group}" type="search" list="user-group-list"/></div>
    <div><div>First Name</div><input class="${this.ufdom.inputs.fname}"/></div>
    <div><div>Last Name</div><input class="${this.ufdom.inputs.lname}"/></div>
    <div><div>Phone</div><input class="${this.ufdom.inputs.phone}"/></div>
    <div><div>Email</div><input class="${this.ufdom.inputs.email}"/></div>
    <div><div>Company</div><input class="${this.ufdom.inputs.company}"/></div>
    <div><div>Joined</div><input class="${this.ufdom.inputs.joined}"/></div>
    <div><div>Title</div><input class="${this.ufdom.inputs.title}"/></div>
    <div><div>Department</div><input class="${this.ufdom.inputs.dept}"/></div>
    <div><div>Report To</div><input class="${this.ufdom.inputs.repto}"/></div>
    <div><div>Job Description</div><input class="${this.ufdom.inputs.jdescr}"/></div>
    <div><div>Photo</div><input class="${this.ufdom.inputs.photo}"/></div>
  </div>`;

  submit(){
    return new Promise((resolve,reject)=>{
      let item = this.form;
      if(item){
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
              request:'settings'
            },
            pack:{
              setting:'users',
              method:'insert',
              options:{
                docs:this.form
              }
            }
          })
        }
        fetch('/admin',options)
          .then(response=>{return response.json()})
          .then(data=>{return resolve(data);})
          .catch(err=>{console.log(err);})
      }else{return resolve({success:false});}
    });
  }
}


class VHCform{
  constructor(cont){
    this.cont=cont;
    this.inputs={}
  }


  set form(input){
    input=this.fltr(input);
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

  fltr(f){return f;}

  switch(){}
  validate(){}
  submit(){}

  setinputs(inputs){
    for(let i in inputs){
      try{this.inputs[i]=this.cont.getElementsByClassName(inputs[i])[0];}
      catch{console.log(`Class ${i} is not declared in Form ${this.cont} it has been left out of this.inputs`)}
    }
    console.log(this.inputs)
  }
}

export{VHCform}

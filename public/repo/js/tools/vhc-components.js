//create
//destroy
//track
//add element


export var CreateComponent=(comtree={})=>{
  let newele=null;
  for(let ct in comtree){
    newele = document.createElement(ct.split('.')[ct.split('.').length-1]);
    switch(ct[0]){
      case '#':{ newele.id=ct.split('.')[0].split('#')[1]; break;} //initialize id
      case '.':{ newele.classList.add(ct.split('.')[1]);break;}
    }
    if(comtree[ct].attributes){
      for(let ca in comtree[ct].attributes){
        if(ca=='class'){newele.classList.add(...comtree[ct].attributes[ca].split(' '))}
        else{newele.setAttribute(ca,comtree[ct].attributes[ca]);}
      }
    }
    if(comtree[ct].children){
      for(let childs in comtree[ct].children){
        newele.appendChild(CreateComponent({[childs]:comtree[ct].children[childs]}));
      }
    }
    return newele;
  }
}

var ffdom = {
  cont:'vg-float-frame',
  open:'vg-float-frame-open',
  close:'vg-float-frame-close',
  view:'vg-float-view',
  selected:'vg-float-view-selected'
}

var RESETframe=(cont)=>{
  let list = cont.getElementsByClassName(ffdom.selected);
  cont.classList.remove(ffdom.open);
  for(let x=0;x<list.length;x++){
    list[x].classList.remove(ffdom.selected);
  }
}

var SELECTview=(cont,title)=>{
  let list = cont.getElementsByClassName(ffdom.view);
  RESETframe(cont);
  cont.classList.add(ffdom.open);
  for(let x=0;x<list.length;x++){
    if(list[x].title == title){list[x].classList.add(ffdom.selected)}
  }
}

try{
  document.getElementById(ffdom.close).addEventListener('click',(ele)=>{
    //console.log(ele.target.parentNode);
    ele.target.parentNode.classList.remove(ffdom.open);
  });
}catch{}

export{
  ffdom,
  SELECTview,
  RESETframe
}

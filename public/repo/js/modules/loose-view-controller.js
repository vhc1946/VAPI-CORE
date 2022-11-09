


/* SETUP loose views
    PASS:
    - views = array of view containers holding the linked view groups, can have multiple
              view containers
    - nav = container holding the group buttons (containing the associated group class
            name).
*/
var SETUPviews=(views,nav)=>{
}



var SWITCHgroupview=(grpselects=[],grpnames=[],navcont)=>{
  RESETviews(navcont,grpnames);
  for(let x=0;x<grpselects.length;x++){
    let sviews = document.getElementsByClassName(grpselects[x]);
    for(let y=0;y<sviews.length;y++){$(sviews[y]).show()}
  }
}

var RESETviews=(navcont,grpnames)=>{
  for(let x=0;x<grpnames.length;x++){
    let gviews = document.getElementsByClassName(grpnames[x]);
    for(let y=0;y<gviews.length;y++){
      if(gviews[y].parentNode!=navcont){$(gviews[y]).hide()}
    }
  }
}

var GETSelected=(cont,selected,groups)=>{
  let glist = [];
  for(let i=0;i<cont.children.length;i++){
    if(cont.children[i].classList.contains(selected)){
      for(let y=0;y<groups.length;y++){
        if(cont.children[i].classList.contains(groups[y])){
          glist.push(groups[y]);
          break;
        }
      }
    }
  }
  if(glist.length==0){return groups}
  return glist;
}


exports{
  SWITCHgroupview,
  RESETviews,
  GETSelected
}

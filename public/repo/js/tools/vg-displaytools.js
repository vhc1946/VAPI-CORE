/* Display Tools
    This file holds properties/methods to make displaying data easier
*/


/* FIND parentNode
    Usually used in events to ensure the event belongs to the corrent element
*/
var FINDparentele=(ele,stop)=>{
  if(ele.classList.contains(stop)||ele==document.body){
    if(ele!=document.body){return ele}
    else{return null}
  }else{return FINDparentele(ele.parentNode,stop);}
}

/////////////////////

var SETdatalistFROMarray = (list,dlistname)=>{
  let dele = document.getElementById(dlistname);
  if(dele){
      dele.innerHTML = '';
      for(let it in list){
          dele.appendChild(document.createElement('option')).innerText = list[it] ;
      }
  }else{console.log(dele + ' was not load into data list')}
}

var SETdatalistFROMobject = (list,dlistname)=>{
  let dele = document.getElementById(dlistname);
  if(dele){
      dele.innerHTML = '';
      for(let it in list){
          dele.appendChild(document.createElement('option')).innerText = it ;
      }
  }else{console.log(dele + ' was not load into data list')}
}

/* Set <datalist> for input drop downs //////////////////////////////////
    PASS:
        dlist = object with property names matching the desired list
                property values hold the datalist name
        mlist = list of objects to create data list from

    requires that mlist is an array of objects, and that dlist is an
     object with property names === desired properties in the objects
     of the array. THIS ONLY WORKS with a flat object, where the names
     in dlist are not nested in any way in the array of objects.
    The actual values of dlist (not the property names) are the names
     for the datalist elements to place the list.
*/
var SETdatalistSPC = (mlist, dlists)=>{
    var tlist = []; // array to track unique values for list

    if(dlists){
        for(var dl in dlists){
            tlist[dl] = []; //create an empty array
        }

        for(let x=0; x<mlist.length;x++){
            for(let dl in dlists){
                let y;
                for(y=0;y<tlist[dl].length;y++){
                  if(tlist[dl][y] == mlist[x][dl]){
                      break;
                  }
                }
                if(y == tlist[dl].length ){
                    tlist[dl].push(mlist[x][dl]);
                }
            }
        }
        for(dl in tlist){
            let dele = document.getElementById(dlists[dl]);
            if(dele){
                dele.innerHTML = '';
                for(let x = 0;x<tlist[dl].length;x++){
                    dele.appendChild(document.createElement('option')).innerText = tlist[dl][x];
                }
            }else{console.log(dl + ' was not load into data list')}
        }
    }
}

/* Get <datalist> ///////////////////////////////////////////////////////
    reads the options of a datalist element into an array
*/
var GETdatalist = (dlistname)=>{
    var dlist;
    try{
        let tlist = []; //empty array to hold all list items
        dlist = document.getElementById(dlistname);
        for(let x=0;x<dlist.children.length;x++){
            tlist.push(dlist.children[x].innerText);
        }
        return tlist;
    }
    catch(e){
        return false;
    }
}
/////////////////////////////////////////////////////////////////////////

export {
  FINDparentele,
  SETdatalistFROMarray,
  SETdatalistFROMobject,
  SETdatalistSPC,
  GETdatalist
};

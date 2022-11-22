
var {ExcelDateToJSDate} = require('../../tools/box/xltools.js')
/* Service Item File ////////////////////////////////////////////////////////

*////////////////////////////////////////////////////////////////////////////

var aserviceitem = (si)=>{
    if(!si || si==undefined){
        si = {};
    }
    return {
        id: si.id || '',
        tagnum: si.tagnum || '',

        type: si.type || '',
        status: si.status || '',
        area: si.area || '',
        location: si.location || '',
        desc: si.desc || '',
        manf: si.manf || '',
        model: si.model || '',
        serial: si.serial || '',
        insdate: si.insdate || '',
        warr1: si.warr1 || '',
        warr2: si.warr2 || '',
        warr3: si.warr3 || '',

        ///////////////////////////////////////////


        filt1:  si.filt1 || '',
        filt1q: si.filt1q || '',
        filt2: si.filt2 || '',
        filt2q: si.filt2q || '',
        beltsize: si.beltsize || '',
        controls: si.controls || '',
        refri: si.refri || '',
        elec: si.elec || '',
    }
}

var vjserviceitemmap = (vjsi = null) => {
    if (!vjsi || vjsi==undefined){
        vjsi = {}
    }
    return {
        id: vjsi['id        '] || '',  //References Customer ID
        tagnum: vjsi['tagNum'] || '',
        type: vjsi['unitType '] || '',
        status: vjsi['status'] || '',
        area: vjsi['area      '] || '',
        location: vjsi['location '] || '',
        desc: vjsi['descr       '] || '',
        manf: vjsi['manufacturer        '] || '',
        model: vjsi['modelNum     '] || '',
        serial: vjsi['serialNum    '] || '',
        insdate: vjsi['installD'] ?ExcelDateToJSDate(vjsi['installD']) : '',
        warr1: vjsi['warr1   '] || '',
        warr2: vjsi['warr2   '] || '',
        warr3: vjsi['warr3   '] || '',
        filt1: vjsi['filt1                         '] || '',
        filt1q: vjsi[' filt1qnty'] || '',
        filt2: vjsi['filt2                         '] || '',
        filt2q: vjsi[' filt2qnty'] || '',
        beltsize: vjsi['beltsize                      '] || '',
        controls: vjsi['controls'] || '',
        refri: vjsi['refrigerant                   '] || '',
        elec: vjsi['volt-phase'] || '',
    }
}

module.exports = {
    aserviceitem,
    vjserviceitemmap
}

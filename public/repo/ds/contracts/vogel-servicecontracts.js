var {ExcelDateToJSDate}=require('../../tools/box/xltools.js');

/* Service Contract File ////////////////////////////////////////////////////

*////////////////////////////////////////////////////////////////////////////


var aservicecontract = (sc=null)=>{
    if(!sc||sc==undefined){
        sc = {};
    }
    return{
        id:sc.id ||'', //this contract number (unique value)
        origid:sc.origid||'', //the first contract number
        renewid:sc.renewid||'', //the last contract number

        value:sc.value||'',

        type:sc.type||'', //describes contract
        cat:sc.cat||'', //reflect department
        status:sc.status||'',

        custid:sc.custid||'',
        billto:sc.billto||'',

        billings : String(sc.billings || ''),

        signdate : ExcelDateToJSDate(sc.signdate),
        startdate : ExcelDateToJSDate(sc.startdate),
        enddate : ExcelDateToJSDate(sc.enddate),
        sendrenew: ExcelDateToJSDate(sc.sendrenew)
    }
}

var vjservicecontractmap=(vjsc)=>{
    if(!vjsc||vjsc==undefined){
        vjsc = {};
    }
    return{
        id:vjsc['current id']?String(vjsc['current id']):'', //this contract number (unique value)

        origid:vjsc['orginal id']?String(vjsc['orginal id']):'', //the first contract number
        renewid:vjsc['renew num ']?String(vjsc['renew num ']):'', //the last contract number

        value:vjsc['          value'] ||'',

        type:vjsc['type      ']?String(vjsc['type      ']):'', //describes contract
        cat:vjsc['cat       ']?String(vjsc['cat       ']):'', //reflect department
        status:vjsc['s'] ||'',

        custid:vjsc['cust code ']?String(vjsc['cust code ']):'',
        billto:vjsc['bill to   ']?String(vjsc['bill to   ']):'',

        billings : vjsc['   bill num'] ||'',

        signdate : ExcelDateToJSDate(vjsc['created ']),
        startdate : ExcelDateToJSDate(vjsc['period fro']),
        enddate : ExcelDateToJSDate(vjsc['period to ']),
        sendrenew: ExcelDateToJSDate(vjsc['send renew'])
    }
}

module.exports = {
    aservicecontract,
    vjservicecontractmap
}

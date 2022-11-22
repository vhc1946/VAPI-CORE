/* Customer File ////////////////////////////////////////////////////////////
    Anything that is/needs to be attached to a customer.

*////////////////////////////////////////////////////////////////////////////


var acustomer = (c=null)=>{
    if(!c || c==undefined){c={};}
    return{
        id: c.id ||'',
        name: c.name || '',
        street: c.street || '',
        unit: c.unit || '',
        city:c.city || '',
        state: c.state || '',
        zip: c.zip || '',
        strdate: c.strdate || '',
        lastsale: c.lastsale || '',
        type: c.type || '',
        phone: c.phone || '',
        phone2: c.phone2 || '',
        email: c.email || '',
        rep: c.rep || '',
    }
}

var vjcustomermap = (vjc = null) => {
    if (!vjc || vjc==undefined){
        vjc = {}
    }
    return {
        id: vjc['id        '] || '', //This is the key
        name: vjc['name                               '] || '',
        street: vjc['street                        '] || '',
        unit: vjc['unit                          '] || '',
        city: vjc['state               '].split(',')[0].trim() || '', //split the city
        state: vjc['state               '].split(',')[1].trim() || '', //split the state
        zip: vjc['zip       '] || '',
        strdate: vjc['startDate '] ?ExcelDateToJSDate(vjc['startDate ']) : '',
        lastsale: vjc['lastSaleDa'] ?ExcelDateToJSDate(vjc['lastSaleDa']) : '',
        type: vjc['type      '] || '',
        phone: vjc['phone       '] || '',
        phone2: vjc['phone2      '] || '',
        email: vjc['emial                               '] || '',
        rep: vjc['rep    '] || '',
    }
}


module.exports={
    acustomer,
    vjcustomermap
}

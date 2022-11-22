
var {acustomer}=require('../customers/vogel-customers.js');
/* Vogel Quote ////////////////////////////////////////////////////////////////////
*/
var aquote = (q=null)=>{
    if(!q||q==undefined){q = {};}
    return {
        id: q.id || '', //has to be unique
        name: q.name || '', //does not have to be unique

        street: q.street || '',
        unit: q.unit || '',
        city:q.city || '',
        state: q.state || '',
        zip: q.zip || '',

        customer: acustomer(q.customer),

        status: q.status || 'O', //initialize 'O' (OPEN)

        dept:q.dept||'',
        cat: q.cat || '',

        estimator:q.estimator||'',//employee code

        info:q.info || {}, //info for a specific type of quote,

        opendate: q.opendate || new Date().toISOString().split('T')[0],
        lastdate: q.lastdate || new Date().toISOString().split('T')[0],
        subdate: q.subdate || null,
        apprdate: q.apprdate || null,
        closedate: q.closedate || null
    }
}

module.exports = {
    aquote
}
///////////////////////////////////////////////////////////////////////////////////

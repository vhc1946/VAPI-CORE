VAPI
Making calls --------------------------------------------------------------------
urls
- /apps - used to access app store
- /admin - used to manage node/stores

body:{
  access:{
    coid: 'company id',
    app: 'application's registered name',
    user: 'user name',
    pswrd:'password'
  }
  pack:{contain request information dependent on url}
}

/apps {body}
pack:{
  db:'store name',
  method: 'request type',
  options: {}
}

/apps {pack.method=='query'} //get document(s) for store
pack.options:{
  query: {//pass properties of doc}
}

/apps {pack.method=='update'} //update document(s) in store
pack.options:{
  query: {//pass properties of doc},
  update: {},
  options: {}
}

/apps {pack.method=='insert'} //insert document(s) in store
pack.options:{
  docs: {}||[]
}

/apps {pack.method=='remove'} //remove document(s) from store
pack.options:{
  query: {//pass properties of doc},
  multi: TRUE||FALSE
}

--------------------------------------------------------------------------------

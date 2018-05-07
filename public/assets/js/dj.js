function fetchGet(query,dataResponse){
  fetch(query)
    .then(function(response) {
      return response.json();
    }).then(function(json) {
      dataResponse(json);
    }).catch(function(ex) {
      console.log('error en ',query);
      console.log(ex);
    })
}
function fetchPost(query,params,callback){
  fetch(query, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(params)
  })
  .then(function(res) {
    return res.json();
  }).then(function(json) {
    callback(json);
  }).catch(function(ex) {
    console.log('error en ',query);
    console.log(ex);
  });
}
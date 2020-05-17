// const querystring = require('querystring')

module.exports =  function postParams(req) {
  return new Promise((resolve, reject) => {
    let str = "";
    req.on("data", function (data) {
      str += data;
    })
    req.on("end", function () { 
      if (str == '') {resolve(str)}
      var post = JSON.parse(str);
      resolve(post)
    })
  })
} 
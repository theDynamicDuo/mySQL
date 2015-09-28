var config = require('./config.js');
var orchestrate = require('orchestrate')(config.dbkey);

orchestrate.put('users', 'adams-user-id', {
  "name": "Adam Taitano",
  "hometown": "Portland, OR"
})
.then(function (res) {
  console.log(res.statusCode);
})
.fail(function (err) {});

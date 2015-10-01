var pgconfig = require('./config');
var express = require("express");
var bodyParser = require("body-parser");
// var db = require('orchestrate')(config.dbkey);
var pg = require('pg');
// or native libpq bindings
// var pg = require('pg').native

var app = express();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: false}));
app.use(express.static(__dirname));

var conString = process.env.ELEPHANTSQL_URL || "postgres://awdtqouh:" + pgconfig.pgkey + "@pellefant.db.elephantsql.com:5432/awdtqouh";
///### INSTANCE WITH CONNECT AND END####///
// var client = new pg.Client(conString);
// client.connect(function(err) {
//   if(err) {
//     return console.error('could not connect to postgres', err);
//   }
// client.query(), function(err, result) {
//   if(err) {
//     return console.error('error running query', err);
//   }
//   console.log(result);
//   //output: Tue Jan 15 2013 19:12:47 GMT-600 (CST)
//   client.end();
//   });
// });

//insert into site_user (name) values (‘insert_name_here’)
//"update task set title = 'New Title', description = 'not stuff', creator= 5, assignee = 1, status = 'Assigned' where id = 4"


app.get('/users', function (req, res) {
  //this initializes a connection pool
  //it will keep idle connections open for a (configurable) 30 seconds
  //and set a limit of 20 (also configurable)
  pg.connect(conString, function(err, client, done) {
    if(err) {
      return console.error('error fetching client from pool', err);
    }
    client.query('select * from site_user', function(err, result) {
      //call `done()` to release the client back to the pool
      done();

      if(err) {
        return console.error('error running query', err);
      }
      // console.log(result.rows);
      var data = result.rows;
        var mapped = data.map(function (element, index) {
          return {id: element.id, username: element.name};
        });

      res.send(mapped);
      //output: 1
    });
  });
});
//****reference for orchestrate for app.get(/users)***//
// db.list('users')
// .then(function (result) {
//   var data = result.body.results;
//   var mapped = data.map(function (element, index) {
//     return {id: element.path.key, username: element.value.username};
//   });
//   res.send(mapped);
// });

app.get('/userTasks/:username', function (req, res) {
  var username = req.params.username;
  var id;
  var queryResults;

  pg.connect(conString, function(err, client, done) {
    if(err) {
      return console.error('error fetching client from pool', err);
    }

    client.query('select * from site_user where name = \'' + username + '\'', function(err, result) {
      if(err) {
        return console.error('error running query1 of get', err);
      }
      console.log("query1 result.rows: ", result.rows);

      id = result.rows[0].id;
      console.log('the initial query found an id of: ', id);

      client.query('select task.id, task.title, task.description, site_user.name as creator, task.assignee, task.status into tempTable from task left join site_user on task.creator = site_user.id', function(err, result) {
        if(err) {
          return console.error('error running query2 of get', err);
        }
        console.log("query2 result.rows: ", result.rows);

        client.query('select tempTable.id, tempTable.title, tempTable.description, tempTable.creator, site_user.name as assignee, tempTable.status into tempTable2 from tempTable left join site_user on tempTable.assignee = site_user.id', function(err, result) {
          if(err) {
            return console.error('error running query3 of get', err);
          }
          console.log("query3 result.rows: ", result.rows);

          client.query('drop table tempTable', function(err, result) {
            if(err) {
              return console.error('error running query4 of get', err);
            }
            console.log("query4 result.rows: ", result.rows);

            client.query('select * from tempTable2 where (creator = \'' + username + '\' or assignee = \'' + username + '\')', function(err, result) {
              if(err) {
                return console.error('error running query5 of get', err);
              }
              console.log("query5 result.rows: ", result.rows);

              queryResults = result;
              console.log("queryResults is: ", queryResults);

              client.query('drop table tempTable2', function(err, result) {
                if(err) {
                  return console.error('error running query6 of get', err);
                }
                console.log("query6 result.rows: ", result.rows);

                done();

                var mapped = queryResults.rows.map(function (element, index) {
                  return {id: element.id, title: element.title, description: element.description, creator: element.creator, assignee: element.assignee, status: element.status};
                });

                console.log("mapped is: ", mapped);
                res.send(mapped);
              });
            });
          });
        });
      });
    });
  });
});
//***REFERENCE TO ORCHESTRATE FOR APP.GET/userTasks*****//
// db.search('tasks', 'value.assignee:'+ username +' OR value.creator:' +username)
// .then(function (result) {
//   var data = result.body.results;
//   var mapped = data.map(function (element, index) {
//     return {id: element.path.key, title: element.value.title, description: element.value.description, creator: element.value.creator, assignee: element.value.assignee, status: element.value.status};
//   });
//   res.send(mapped);
// })
// .fail(function (err) {});
//
// app.get('/unassignedTasks/:username', function (req, res) {
//   console.log("/unassignedTasks/:username GET route initiated");
//   var username = req.params.username;
//   db.search('tasks', 'value.status: "Unassigned" AND value.creator: (NOT ' + username + ')')
//   .then(function (result) {
//     console.log("db.search successful");
//     var data = result.body.results;
//     var mapped = data.map(function (element, index) {
//       return {id: element.path.key, title: element.value.title, description: element.value.description, creator: element.value.creator, assignee: element.value.assignee, status: element.value.status};
//     });
//     res.send(mapped);
//   })
//   .fail(function (err) {console.log("db.search not successful");});
// });


app.post('/users', function (req, res) {
  var id;
  db.list('users')
  .then(function(result) {
    id = result.body.count + 1;
    // console.log(id);
    db.put('users', id, {"username" : req.body.username})
    .then(function(result) {
      // console.log(req.body.username);
      res.send({id: id});
    });
  });
});


app.put('/tasks/:id', function (req, res) {
  console.log("userTasks PUT initiated");
  var id = req.params.id;
  db.put('tasks', id, {"title" : req.body.title, "description" : req.body.description, "creator" : req.body.creator, "assignee" : req.body.assignee, "status": req.body.status})
  .then(function(result) {
    console.log("task update works");
    res.send({id: id});
  });
});

app.post('/tasks', function (req, res) {   // was previously set to /userTasks/:username
  console.log("userTasks POST initiated");
  var id;
  db.list('tasks')
  .then(function(result) {
    id = result.body.count + 1;
    db.put('tasks', id, {"title" : req.body.title, "description" : req.body.description, "creator" : req.body.creator, "assignee" : req.body.assignee, "status": req.body.status})
    .then(function(result) {
      console.log("task create works");
      res.send({id: id});
    });
  });
});

app.put('/tasks/:id', function (req, res) {
  console.log("unassignedTasks PUT initiated");
  var id = req.params.id;
  db.put('tasks', id, {"title" : req.body.title, "description" : req.body.description, "creator" : req.body.creator, "assignee" : req.body.assignee, "status": req.body.status})
  .then(function(result) {
    console.log("task update works");
    res.send({id: id});
  });
});

app.post('/unassignedTasks', function (req, res) {
  console.log("unassignedTasks POST initiated");
  var id;
  db.list('tasks')
  .then(function(result) {
    id = result.body.count + 1;
    db.put('tasks', id, {"title" : req.body.title, "description" : req.body.description, "creator" : req.body.creator, "assignee" : req.body.assignee, "status": req.body.status})
    .then(function(result) {
      console.log("task create works");
      res.send({id: id});
    });
  });
});

app.listen(3000, function () {
  console.log("Server is running...........");
});

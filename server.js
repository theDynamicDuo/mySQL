var express = require("express");
var bodyParser = require("body-parser");
var config = require('./config');
var pg = require('pg');
var mysql = require('mysql');
var app = express();
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: false}));
app.use(express.static(__dirname));
// var connection = mysql.createConnection({
//   host     : 'adamandjeff.cam975huvdwe.us-west-2.rds.amazonaws.com',
//   user     : 'aandj',
//   password : 'adamandjeff',
//   database : 'mysqlpractice'
// });


// var conString = process.env.ELEPHANTSQL_URL || "postgres://awdtqouh:" + pgconfig.pgkey + "@pellefant.db.elephantsql.com:5432/awdtqouh";
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

app.get('/users', function (req, res) {
//   connection.connect(function (err) {
//   if (err) {
//     console.error('error connecting: ' + err.stack);
//     return;
//   }
// });
var connection = mysql.createConnection(config);

  connection.query('select * from site_user', function(err, rows, fields) {
    if (err) throw err;

    console.log('The result is: ', rows);
    var data = rows;
    console.log(data);
      var mapped = data.map(function (element, index) {
        return {id: element.id, username: element.name};
      });

    res.send(mapped);
  });

  connection.end();
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

  var connection = mysql.createConnection(config);


    connection.query('select * from site_user where name = \'' + username + '\'', function(err, result) {
      if(err) {
        return console.error('error running query1 of get', err);
      }
      // console.log("query1 result.rows: ", result);

      id = result[0].id;
      // console.log('the initial query found an id of: ', id);

        connection.query('create temporary table tempTable (select task.id, task.title, task.description, site_user.name as creator, task.assignee, task.status from task left join site_user on task.creator = site_user.id)', function(err, result) {
          if(err) {
            return console.error('error running query3 of get', err);
          }
          // console.log("query2 result.rows: ", result);

          connection.query('create temporary table tempTable2 (select tempTable.id, tempTable.title, tempTable.description, tempTable.creator, site_user.name as assignee, tempTable.status from tempTable left join site_user on tempTable.assignee = site_user.id)', function(err, result) {
            if(err) {
              return console.error('error running query4 of get', err);
            }
            // console.log("query3 result.rows: ", result);

            connection.query('drop temporary table tempTable', function(err, result) {
              if(err) {
                return console.error('error running query5 of get', err);
              }
              // console.log("query4 result.rows: ", result);

              connection.query('select * from tempTable2 where (creator = \'' + username + '\' or assignee = \'' + username + '\')', function(err, result) {
                if(err) {
                  return console.error('error running query6 of get', err);
                }
                // console.log("query5 result.rows: ", result);

                queryResults = result;

                connection.query('drop table tempTable2', function(err, result) {
                  if(err) {
                    return console.error('error running query7 of get', err);
                  }
                  // console.log("query6 result.rows: ", result);

                  // connection.end();

                  var mapped = queryResults.map(function (element, index) {
                    return {id: element.id, title: element.title, description: element.description, creator: element.creator, assignee: element.assignee, status: element.status};
                  });

                // console.log("mapped is: ", mapped);
                res.send(mapped);
                connection.end();
              });
            });
          });
        });
      });
    });
  });
// });
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

app.get('/unassignedTasks/:username', function (req, res) {
  console.log("/unassignedTasks/:username GET route initiated");
  var username = req.params.username;
  var id;
  var queryResults;

  var connection = mysql.createConnection(config);


    connection.query("select task.id, task.title, task.description, site_user.name as creator, '' as assignee, task.status from task left join site_user on task.creator = site_user.id where (task.status = 'Unassigned' and site_user.name <> \'" + username + "\')", function(err, result) {
      if(err) {
        return console.error('error running query1 of get', err);
      }
      console.log("query1 result.rows: ", result);

      queryResults = result;
      // done();

      var mapped = queryResults.map(function (element, index) {
        return {id: element.id, title: element.title, description: element.description, creator: element.creator, assignee: element.assignee, status: element.status};
      });
      res.send(mapped);
      connection.end();
    });
  });
// });
///****** PREVIOUS VERSION USING ORCHESTRATE ******///
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

  var connection = mysql.createConnection(config);

    connection.query('insert into site_user (name) values (\'' + req.body.username + '\')', function(err, result) {
      if(err) {
        return console.error('error running query1 of get', err);
      }
      console.log("query1 result.rows: ", result);

      connection.query('select max(id) from site_user', function(err, result) {
        if(err) {
          return console.error('error running query2 of get', err);
        }
        console.log("query2 result.rows: ", result);

        id = result[0].max;
        // done();

        res.send({id: id});
        connection.end();
      });
    });
});
///****** PREVIOUS VERSION USING ORCHESTRATE ******///
//   db.list('users')
//   .then(function(result) {
//     id = result.body.count + 1;
//     // console.log(id);
//     db.put('users', id, {"username" : req.body.username})
//     .then(function(result) {
//       // console.log(req.body.username);
//       res.send({id: id});
//     });
//   });
// });

app.put('/tasks/:id', function (req, res) {
  console.log("userTasks PUT initiated");
  var id = req.params.id;
  var queryResults;

  var connection = mysql.createConnection(config);


    if(req.body.assignee !== '') {
      connection.query('select id from site_user where name = \'' + req.body.assignee +'\'', function(err, result) {
        if(err) {
          return console.error('error running query1 of get', err);
        }
        console.log("query1 result.rows: ", result);

        queryResults = result;

        connection.query('update task set assignee = \'' + queryResults[0].id + '\', status = \'' + req.body.status + '\' where id = \'' + id + '\'', function(err, result) {
          if(err) {
            return console.error('error running query2 of get', err);
          }
          console.log("query2 result.rows: ", result);

          connection.end();
          res.send({id: id});
        });
      });
    }
    else {
      connection.query('update task set assignee = null, status = \'' + req.body.status + '\' where id = \'' + id + '\'', function(err, result) {
        if(err) {
          return console.error('error running query1 of get', err);
        }
        console.log("query1 result.rows: ", result);

        connection.end();

        res.send({id: id});
      });
    }
});
///****** PREVIOUS VERSION USING ORCHESTRATE ******///
// db.put('tasks', id, {"title" : req.body.title, "description" : req.body.description, "creator" : req.body.creator, "assignee" : req.body.assignee, "status": req.body.status})
// .then(function(result) {
//   console.log("task update works");
//   res.send({id: id});
// });

///****** PREVIOUS VERSION USING ORCHESTRATE ******///
app.post('/tasks', function (req, res) {   // was previously set to /userTasks/:username
  console.log("userTasks POST initiated");
  var id;
  var queryResultsCreator;
  var queryResultsAssignee;

  var connection = mysql.createConnection(config);

    connection.query('select id from site_user where name = \'' + req.body.creator + '\'', function(err, result) {
      if(err) {
        return console.error('error running query1 of get', err);
      }
      console.log("query1 result.rows: ", result);

      queryResultsCreator = result;

      if(req.body.assignee !== '') {
        connection.query('select id from site_user where name = \'' + req.body.assignee + '\'', function(err, result) {
          if(err) {
            return console.error('error running query2 of get', err);
          }
          console.log("query2 result.rows: ", result);

          queryResultsAssignee = result;

          connection.query('insert into task (title, description, creator, assignee, status) values (\'' + req.body.title + '\', \'' + req.body.description + '\', \'' + queryResultsCreator[0].id + '\', \'' + queryResultsAssignee[0].id + '\', \'' + req.body.status + '\')', function(err, result) {
            if(err) {
              return console.error('error running query3 of get', err);
            }
            console.log("query3 result.rows: ", result);

            connection.query('select max(id) from task', function(err, result) {
              if(err) {
                return console.error('error running query4 of get', err);
              }
              console.log("query4 result.rows: ", result);

              id = result[0].max;
              connection.end();

              res.send({id: id});
            });
          });
        });
      }
      else {
        connection.query('insert into task (title, description, creator, assignee, status) values (\'' + req.body.title + '\', \'' + req.body.description + '\', \'' + queryResultsCreator[0].id + '\', null, \'' + req.body.status + '\')', function(err, result) {
          if(err) {
            return console.error('error running query2 of get', err);
          }
          console.log("query2 result.rows: ", result);

          queryResultsAssignee = result;

          connection.query('select max(id) from task', function(err, result) {
            if(err) {
              return console.error('error running query3 of get', err);
            }
            console.log("query3 result.rows: ", result);

            id = result[0].max;
            connection.end();

            res.send({id: id});
          });
        });
      }
    });
});
///****** PREVIOUS VERSION USING ORCHESTRATE ******/// /// BELIEVED TO BE REDUNDANT ///
// app.put('/tasks/:id', function (req, res) {
//   console.log("unassignedTasks PUT initiated");
//   var id = req.params.id;
//   db.put('tasks', id, {"title" : req.body.title, "description" : req.body.description, "creator" : req.body.creator, "assignee" : req.body.assignee, "status": req.body.status})
//   .then(function(result) {
//     console.log("task update works");
//     res.send({id: id});
//   });
// });

///****** PREVIOUS VERSION USING ORCHESTRATE ******/// /// BELIEVED TO BE REDUNDANT ///
// app.post('/unassignedTasks', function (req, res) {
//   console.log("unassignedTasks POST initiated");
//   var id;
//   db.list('tasks')
//   .then(function(result) {
//     id = result.body.count + 1;
//     db.put('tasks', id, {"title" : req.body.title, "description" : req.body.description, "creator" : req.body.creator, "assignee" : req.body.assignee, "status": req.body.status})
//     .then(function(result) {
//       console.log("task create works");
//       res.send({id: id});
//     });
//   });
// });

app.listen(3000, function () {
  console.log("Server is running...........");
});

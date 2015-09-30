var config = require('./config.js');
var express = require("express");
var bodyParser = require("body-parser");
var db = require('orchestrate')(config.dbkey);

var app = express();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: false}));
app.use(express.static(__dirname));

app.get('/users', function (req, res) {
  db.list('users')
  .then(function (result) {
    var data = result.body.results;
    var mapped = data.map(function (element, index) {
      return {id: element.path.key, username: element.value.username};
    });
    res.send(mapped);
  });
});

  // .fail(function (err) {  console.log("this failed :", err);

  // var usersAndIDs = users.map(function (element, index) {
  //   return {id: index, username: element};
  // });
  // console.log(mapped);

app.get('/userTasks/:username', function (req, res) {
  var username = req.params.username;
  db.search('tasks', 'value.assignee:'+ username +' OR value.creator:' +username)
  .then(function (result) {
    var data = result.body.results;
    var mapped = data.map(function (element, index) {
      return {id: element.path.key, title: element.value.title, description: element.value.description, creator: element.value.creator, assignee: element.value.assignee, status: element.value.status};
    });
    res.send(mapped);
  })
  .fail(function (err) {});
});

//   db.list('tasks')
//   .then(function (result) {
//     var data = result.body.results;
//     var mapped = data.map(function (element, index) {
//       return {id: element.path.key, title: element.value.title, description: element.value.description, creator: element.value.creator, assignee: element.value.assignee, status: element.value.status};
//     });
//     console.log(mapped);
//     res.send(mapped);
//   });

app.get('/unassignedTasks/:username', function (req, res) {
  console.log("/unassignedTasks/:username GET route initiated");
  var username = req.params.username;
  db.search('tasks', 'value.status: "Unassigned" AND value.creator: (NOT ' + username + ')')
  .then(function (result) {
    console.log("db.search successful");
    var data = result.body.results;
    var mapped = data.map(function (element, index) {
      return {id: element.path.key, title: element.value.title, description: element.value.description, creator: element.value.creator, assignee: element.value.assignee, status: element.value.status};
    });
    res.send(mapped);
  })
  .fail(function (err) {console.log("db.search not successful");});
});

  // db.list('tasks')
  // .then(function (result) {
  //   var data = result.body.results;
  //   var mapped = data.map(function (element, index) {
  //     return {id: element.path.key, title: element.value.title, description: element.value.description, creator: element.value.creator, assignee: element.value.assignee, status: element.value.status};
  //   });
  //   console.log(mapped);
  //   res.send(mapped);
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

// app.put('/tasks/:id', function (req, res) {
//     var id = req.params.id;
//     db.put('tasks', id, {"title" : req.body.title, "description" : req.body.description, "creator" : req.body.creator, "assignee" : req.body.assignee, "status": req.body.status})
//       .then(function(result) {
//         console.log("tasks update works");
//         res.send({id: id});
//     });
//     // tasks[id] = [req.body.title, req.body.description, req.body.creator, req.body.assignee, req.body.status];
//     // res.send({id: id});
// });

// app.post('/tasks', function (req, res) {
//     // var id = tasks.length;
//     var id;
//     db.list('tasks')
//     .then(function(result) {
//       id = result.body.count + 1;
//       // console.log(id);
//       db.put('tasks', id, {"title" : req.body.title, "description" : req.body.description, "creator" : req.body.creator, "assignee" : req.body.assignee, "status": req.body.status})
//         .then(function(result) {
//           console.log("tasks create works");
//           res.send({id: id});
//       });
//     });
//     // tasks[id] = [req.body.title, req.body.description, req.body.creator, req.body.assignee, req.body.status];
//     // res.send({id: id});
// });

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

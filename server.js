
var express = require("express");
var bodyParser = require("body-parser");

var app = express();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: false}));
app.use(express.static(__dirname));

// var users = [];
var users = ["Sparky", "Skippy", "Arturo"];
// var tasks = [];
var tasks = [
  ["Steal Redvines","Run from coppers","Skippy","","Unassigned"],
  ["The big bug","don't break","Sparky","","Unassigned"],
  ["broken one","this one is broken","Skippy","Skippy","Done"],
  ["Something","Something else","Anyone","Skippy","Assigned"],
  ["Give Redvines","Hi five coppers","Evil Abe","","Unassigned"],
  ["Write a book","finish it before i die(GRRM)","Kanye East","Arturo","Assigned"]
];

app.get('/users', function (req, res) {
  var usersAndIDs = users.map(function (element, index) {
    return {id: index, username: element};
  });
  res.send(usersAndIDs);
});

app.get('/tasks', function (req, res) {
  var tasksAndIDs = tasks.map(function (element, index) {
    return {id: index, title: element[0], description: element[1], creator: element[2], assignee: element[3], status: element[4]};
  });
  res.send(tasksAndIDs);
});

app.put('/users/:id', function (req, res) {
    var id = req.params.id;
    users[id] = req.body.username;
    res.send({id: id});
});

app.post('/users', function (req, res) {
    var id = users.length;
    users[id] = req.body.username;
    res.send({id: id});
});

app.put('/tasks/:id', function (req, res) {
    var id = req.params.id;
    tasks[id] = [req.body.title, req.body.description, req.body.creator, req.body.assignee, req.body.status];
    res.send({id: id});
});

app.post('/tasks', function (req, res) {
    var id = tasks.length;
    tasks[id] = [req.body.title, req.body.description, req.body.creator, req.body.assignee, req.body.status];
    res.send({id: id});
});



// app.get('/texts/:id', function (req, res) {
//     var id = req.params.id;
//     res.send(JSON.stringify({id: id, value : texts[id]}));
// });
//
// app.put('/texts/:id', function (req, res) {
//     var id = req.params.id;
//     tasks[id] = req.body.value;
//     res.send({id: id});
// });
//
// app.delete('/texts/:id', function (req, res) {
//     var id = req.params.id;
//     texts.splice(id, 1);
//     res.send({id: id});
// });
//
// app.get('/texts', function (req, res) {
//     var textsAndIDs = texts.map(function (v, i) {
//         return {id : i, value : v};
//     });
//     res.send(textsAndIDs);
// });



app.listen(3000, function () {
  console.log("Server is running...........");
});

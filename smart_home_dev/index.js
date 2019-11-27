var express = require("express");
var bodyParser = require('body-parser');

var socketio = require('./src/socketio/socketio');
var mqtt =require('./src/gga/mqtt-vi');
var firebase = require('firebase');
var firebaseAdmin = require("firebase-admin");
var serviceAccount = require("./smarthome-iot95-firebase.json");

firebase.initializeApp({
    credential: firebaseAdmin.credential.cert(serviceAccount),
    databaseURL: "https://smarthome-iot95.firebaseio.com"
});

var routes = require("./routes/routes.js");

var app = express();
var http = require('http').Server(app);
global.io = require('socket.io')(http); // io is global var

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

var session = require('express-session');

app.use(session({
  key: 'uuid',
  secret: 'keyboard cat',
  resave: false,
  saveUninitialized: true,
  cookie: { secure: false }, //note secure : true for https, false for http so that we can change Session value

}));

app.engine('ejs', require('ejs').renderFile);
app.set('view engine', 'ejs');
app.use(express.static(__dirname + '/src/web/stylesheets'));
app.use(express.static(__dirname + '/src/web/javascripts'));
app.use(express.static(__dirname + '/src/web/views'));
//app.use(express.static(__dirname + '/src/web/views/camera'));
//app.use(express.static(__dirname + '/src/web/views/smart-homes/smart'));
app.use(express.static(__dirname + '/src/admin/stylesheets'));
app.use(express.static(__dirname + '/src/admin/javascripts'));
app.use(express.static(__dirname + '/src/admin/views')); 
routes(app);
socketio.connect();
socketio.recievedSmartHomeId();
//mqtt-vi : google assistant - Vietnammese
mqtt.doAction();

var server = http.listen(3000, function () {
    console.log("app running on port.", server.address().port);
});

/*var express = require('express');
var firebase = require('firebase');
var bodyParser = require('body-parser');
var admin = require("firebase-admin");
var serviceAccount = require("./smarthome-iot95-firebase.json");

const uuidv4 = require('uuid/v4');

var app = express();
app.use(bodyParser.json()); //need to parse HTTP request body

firebase.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  databaseURL: "https://smarthome-iot95.firebaseio.com"
});

//to handle HTTP get request
app.get('/', function (req, res) {
  console.log("HTTP Get Request");
    var userReference = firebase.database().ref("/users/");

    //Attach an asynchronous callback to read the data
    userReference.on("value",
              function(snapshot) {
                    console.log(snapshot.val());
                    res.json(snapshot.val());
                    userReference.off("value");
                    },
              function (errorObject) {
                    console.log("The read failed: " + errorObject.code);
                    res.send("The read failed: " + errorObject.code);
             });
});

app.get('/:id', function (req, res) {
    var userId = req.params['id'];
    var userReference = firebase.database().ref("/users/"+ userId);

     //Attach an asynchronous callback to read the data
    userReference.once("value",
      function(snapshot) {
            console.log(snapshot.val());
            // Logic code here
            res.json(snapshot.val());
            userReference.off("value");
            },
      function (errorObject) {
            console.log("The read failed: " + errorObject.code);
            res.send("The read failed: " + errorObject.code);
     });
});

app.post('/', function (req, res) {
    console.log("HTTP Put Request");
    var user_id = uuidv4();
    var email = req.body.email;
    var name = req.body.name;
    var phone = req.body.phone;

    var referencePath = '/users/'+user_id+'/';
    var userReference = firebase.database().ref(referencePath);
    userReference.set({user_id: user_id, email: email, name: name, phone: phone},
                 function(error) {
                    if (error) {
                        res.send("Data could not be saved." + error);
                    }
                    else {
                        res.send("Data saved successfully.");
                    }
            });
});

app.post('/:id', function (req, res) {
    var userId = req.params['id'];
    var email = req.body.email;
    var name = req.body.name;
    var phone = req.body.phone;

    var userReference = firebase.database().ref("/users/"+ userId);
    userReference.update({email: email, name: name, phone: phone},
                 function(error) {
                    if (error) {
                        res.send("Data could not be updated." + error);
                    }
                    else {
                        res.send("Data updated successfully.");
                    }
                });
});

app.delete('/', function (req, res) {
  console.log("HTTP DELETE Request");
  res.send("HTTP DELETE Request");
});

//start server on port: 8080
var server = app.listen(3000, function () {

  var host = server.address().address;
  var port = server.address().port;

  console.log("server listening at http://%s:%s", host, port);
});
*/

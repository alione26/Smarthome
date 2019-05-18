var firebase = require('firebase');
var firebaseAdmin = require("firebase-admin");
var serviceAccount = require("../smarthome-iot95-firebase.json");

const uuidv4 = require('uuid/v4');

firebase.initializeApp({
  credential: firebaseAdmin.credential.cert(serviceAccount),
  databaseURL: "https://smarthome-iot95.firebaseio.com"
});

var appRouter = function (app) {
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
}

module.exports = appRouter;

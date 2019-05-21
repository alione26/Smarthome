var userService = require("../services/UserService");
const uuidv4 = require('uuid/v4');
module.exports = {
    user_list : async function(req, res, next) {
        console.log("HTTP Get Request");
        //var get_list_user = await userService.get_list();
        //console.log(get_list_user);
        var get_list_user = await userService.get_list();
        console.log(get_list_user);
        if (get_list_user.status) {
             return res.status(200).json({ success : true, message : get_list_user.message, data : get_list_user.data});
         }
        return res.success(400).json({ success : false, message : get_list_user.message});
    },
    new_user : async function (req, res) {
        console.log("HTTP Put Request");
        var user_id = uuidv4();
        var userData = { user_id: user_id, name : req.body.name, email : req.body.email, phone : req.body.phone };
        var create_user = await userService.add_user(userData, user_id);
        console.log(create_user);
        if (create_user.status) {
            return res.status(200).json({ success: true, message: create_user.message });
        }
        return res.status(400).json({ success: false, message: create_user.message});
    },
}
/*var firebase = require('firebase');
var firebaseAdmin = require("firebase-admin");
var serviceAccount = require("../../../smarthome-iot95-firebase.json");

const uuidv4 = require('uuid/v4');

firebase.initializeApp({
  credential: firebaseAdmin.credential.cert(serviceAccount),
  databaseURL: "https://smarthome-iot95.firebaseio.com"
});

module.exports = {
    user_list : function (req, res, next) {
      console.log("HTTP Get Request");
        var userReference = firebase.database().ref("/users/");

        //Attach an asynchronous callback to read the data
        userReference.on("value",
                  function(snapshot) {
                        console.log(snapshot.val());
                        res.json(snapshot.val());
                        //return res.status(200).json({ success: true, data: null, message: "Succesfully" });
                        userReference.off("value");
                        },
                  function (errorObject) {
                        console.log("The read failed: " + errorObject.code);
                        res.send("The read failed: " + errorObject.code);
                 });
    },
    user_by_id : function (req, res) {
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
    },
    new_user : function (req, res) {
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
    },
    update_user : function (req, res) {
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
    },

    delete_user : function (req, res) {
      var userId = req.params['id'];
      var userReference = firebase.database().ref("/users/"+ userId);
      userReference.remove()
      .then(function() {
        console.log("Remove succeeded.");
        res.send("Remove succeeded");
        })
      .catch(function(error) {
        console.log("Remove failed: " + error.message);
        res.send("Remove failed");
        });
      console.log("HTTP DELETE Request");
    },

}*/

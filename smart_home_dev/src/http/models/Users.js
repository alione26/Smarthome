var firebase = require('firebase');
var firebaseAdmin = require("firebase-admin");
var serviceAccount = require("../../../smarthome-iot95-firebase.json");

firebase.initializeApp({
  credential: firebaseAdmin.credential.cert(serviceAccount),
  databaseURL: "https://smarthome-iot95.firebaseio.com"
});

module.exports = {
    get_list : async function() {
        var userReference = firebase.database().ref("/users/");
        try {

              return await userReference.once("value").then(
                         function(snapshot){
                            return { status : true, message :"The read succeeded", data : snapshot.val()};
                            userReference.off("value");

                         },
                         function(errorObject){
                            console.log("The read failed: " + errorObject.code);
                            return { status : false, message : "The read failed: " + errorObject.code };
                         },
              );
        }catch (e) {
            throw Error(e.message);
        }

        //Attach an asynchronous callback to read the data
        /*userReference.on("value",
                  function(snapshot) {

                        res.json(snapshot.val());
                        //return res.status(200).json({ success: true, data: null, message: "Succesfully" });
                        userReference.off("value");
                        },
                  function (errorObject) {

                        res.send("The read failed: " + errorObject.code);
                 });*/
    },
    add_user : async function(userData, user_id) {
        var referencePath = '/users/'+user_id+'/';
        var userReference = firebase.database().ref(referencePath);
        try {
            return await userReference.set(userData).then(
                    function(error) {
                        var response = null;
                        if (error) {
                            response =  { status: false, message: "Data could not be saved." + error };
                        }
                        else {
                           response =  { status: true, message: "Data saved successfully." };
                        }
                        return response;
                    });
        } catch (e) {
            throw Error(e.message);
        }
    },
}

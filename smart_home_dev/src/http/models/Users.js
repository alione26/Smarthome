var firebase = require('firebase');
var firebaseAdmin = require("firebase-admin");
var serviceAccount = require("../../../smarthome-iot95-firebase.json");

firebase.initializeApp({
  credential: firebaseAdmin.credential.cert(serviceAccount),
  databaseURL: "https://smarthome-iot95.firebaseio.com"
});

module.exports = {
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

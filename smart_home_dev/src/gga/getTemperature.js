var firebase = require('firebase');

module.exports = {
  getTemp : async function() {
              var smarthomeReference = firebase.database().ref("/smarthomeDevices/b6995ae2-8ec6-4747-ab4d-e3ca4bb0ffd0/data/Temperature");
              try {
                    return await smarthomeReference.once("value").then(
                               function(snapshot){
                                  return { status : true, message :"The read succeeded", data : snapshot.val()};
                                  console.log(snapshot.val())
                                  smarthomeReference.off("value");
                               },
                               function(errorObject){
                                  console.log("The read failed: " + errorObject.code);
                                  return { status : false, message : "The read failed: " + errorObject.code };
                               },
                    );
              }catch (e) {
                  throw Error(e.message);
              }
          },
}

var firebase = require('firebase');

module.exports = {
  getTemp : async function(sensorId) {
              var smarthomeReference = firebase.database().ref("/smarthomeDevices/"+ sensorId +"/data/Temperature");
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
  getHumid : async function(sensorId) {
              var smarthomeReference = firebase.database().ref("/smarthomeDevices/"+ sensorId +"/data/Humidity");
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

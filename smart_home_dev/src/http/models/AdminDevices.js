var firebase = require('firebase');
const uuidv4 = require('uuid/v4');

module.exports = {
  add_adminDevice : async function(adminDeviceData, adminDevice_id) {
      var referencePath = '/adminDevices/'+adminDevice_id+'/';
      var adminDeviceReference = firebase.database().ref(referencePath);
      try {
          return await adminDeviceReference.set(adminDeviceData).then(
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
  getAdminDeviceByAdminId : async function(adminId) {
      var adminDeviceReference = firebase.database().ref("/adminDevices");
      try {
            return await adminDeviceReference.orderByChild("admin_id")
              .equalTo(adminId)
              .once('value').then(
                  function(snapshot){
                      if (snapshot.val()) {
                          return { status : true, message :"The read adminDevices by AdminId succeeded", data : snapshot.val()};
                      }
                      return { status : false, message : "The read adminDevices by AdminId failed", data: null };
                      adminDeviceReference.off("value");
                  },
                  function(errorObject){
                      console.log("The read failed: " + errorObject.code);
                      return { status : false, message : "The read adminDevices by AdminId failed: " + errorObject.code, data: null };
                  }
            );
      }catch (e) {
          throw Error(e.message);
      }
  },
  getAdminDeviceByUUID : async function (uuid) {
      var adminDeviceReference = firebase.database().ref("/adminDevices");
      try {
           return await adminDeviceReference.orderByChild("token")
              .equalTo(uuid)
              .once('value').then(
                  function(snapshot){
                      if (snapshot.val()) {
                          return { status : true, message :"The read Admin Device by Token succeeded", data : snapshot.val()};
                      }
                      return { status : false, message : "The read Admin Device by Token failed", data: null };
                      adminDeviceReference.off("value");
                  },
                  function(errorObject){
                      console.log("The read failed: " + errorObject.code);
                      return { status : false, message : "The read Admin Device by Token failed: " + errorObject.code, data: null };
                  }
            );
      }catch (e) {
          throw Error(e.message);
      }
  },
  generateUUIDByAdminDeviceId : async function (adminDeviceId) {
      var newUuid = uuidv4();
      var referencePath = '/adminDevices/'+adminDeviceId+'/';
      var adminDeviceReference = firebase.database().ref(referencePath);
      await adminDeviceReference.update({"token" : newUuid, "latest" : Math.floor(Date.now()/1000)});
      return newUuid;
  },
}

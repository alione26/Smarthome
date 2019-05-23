var firebase = require('firebase');

module.exports = {
    get_list : async function() {
        var userDeviceReference = firebase.database().ref("/userDevices/");
        try {
              return await userDeviceReference.once("value").then(
                         function(snapshot){
                            return { status : true, message :"The read succeeded", data : snapshot.val()};
                            userDeviceReference.off("value");
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

    add_userDevice : async function(userDeviceData, userDevice_id) {
        var referencePath = '/userDevices/'+userDevice_id+'/';
        var userDeviceReference = firebase.database().ref(referencePath);
        try {
            return await userDeviceReference.set(userDeviceData).then(
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
    userDevice_by_id : async function(userDeviceId) {
        var userDeviceReference = firebase.database().ref("/userDevices/"+ userDeviceId);
        try {
              return await userDeviceReference.once("value").then(
                         function(snapshot){
                            return { status : true, message :"The read succeeded", data : snapshot.val()};
                            userDeviceReference.off("value");
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
    update_userDevice : async function(userDeviceId, userDeviceData) {
        var userDeviceReference = firebase.database().ref("/userDevices/"+ userDeviceId);
        try {
            return await userDeviceReference.update(userDeviceData).then(
                    function(error) {
                        var response = null;
                        if (error) {
                            response =  { status: false, message: "Data could not be updated." + error };
                        }
                        else {
                            response =  { status: true, message: "Data updated successfully." };
                        }
                        return response;
                    });
        } catch (e) {
            throw Error(e.message);
        }
    },
    delete_userDevice : async function(userDeviceId) {
        var userDeviceReference = firebase.database().ref("/userDevices/"+ userDeviceId);
        try {
            return await userDeviceReference.remove().then(
                    function(error) {
                        var response = null;
                        if (error) {
                            response =  { status: false, message: "Data could not be removed." + error };
                        }
                        else {
                            response =  { status: true, message: "Data removed successfully." };
                        }
                        return response;
                    });
        } catch (e) {
            throw Error(e.message);
        }
    },
}

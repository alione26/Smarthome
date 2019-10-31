var firebase = require('firebase');

module.exports = {
    get_list : async function() {
        var smarthomeDeviceReference = firebase.database().ref("/smarthomeDevices/");
        try {
              return await smarthomeDeviceReference.once("value").then(
                         function(snapshot){
                            return { status : true, message :"The read succeeded", data : snapshot.val()};
                            smarthomeDeviceReference.off("value");
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

    add_smarthomeDevice : async function(smarthomeDeviceData, smarthomeDevice_id) {
        var referencePath = '/smarthomeDevices/'+smarthomeDevice_id+'/';
        var smarthomeDeviceReference = firebase.database().ref(referencePath);
        try {
            return await smarthomeDeviceReference.set(smarthomeDeviceData).then(
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
    smarthomeDevice_by_id : async function(smarthomeDeviceId) {
        var smarthomeDeviceReference = firebase.database().ref("/smarthomeDevices/"+ smarthomeDeviceId);
        try {
              return await smarthomeDeviceReference.once("value").then(
                         function(snapshot){
                            return { status : true, message :"The read succeeded", data : snapshot.val()};
                            smarthomeDeviceReference.off("value");
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
    update_smarthomeDevice : async function(smarthomeDeviceId, smarthomeDeviceData) {
        var smarthomeDeviceReference = firebase.database().ref("/smarthomeDevices/"+ smarthomeDeviceId);
        try {
            return await smarthomeDeviceReference.update(smarthomeDeviceData).then(
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
    delete_smarthomeDevice : async function(smarthomeDeviceId) {
        var smarthomeDeviceReference = firebase.database().ref("/smarthomeDevices/"+ smarthomeDeviceId);
        try {
            return await smarthomeDeviceReference.remove().then(
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
    getSmartHomeDeviceBySmartHomeId : async function(smartHomeId) {

        var smartHomeDeviceReference = firebase.database().ref("/smarthomeDevices");
        try {
              return await smartHomeDeviceReference.orderByChild("smarthome_id")
                .equalTo(smartHomeId)
                .once('value').then(
                    function(snapshot){
                        if (snapshot.val()) {
                            return { status : true, message :"The read smarthomeDevices succeeded", data : snapshot.val()};
                        }
                        return { status : false, message : "The read smarthomeDevices failed", data: null };
                        smartHomeDeviceReference.off("value");
                    },
                    function(errorObject){
                        console.log("The read smarthomeDevices failed: " + errorObject.code);
                        return { status : false, message : "The read smarthomeDevices failed: " + errorObject.code, data: null };
                    }
              );
        }catch (e) {
            throw Error(e.message);
        }
    },
}

var firebase = require('firebase');
const uuidv4 = require('uuid/v4');

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
    userDevice_by_token : async function(userDeviceToken) {
        var userDeviceToken = userDeviceToken;
        var userDeviceReference = firebase.database().ref("/userDevices/");
        try {
            return await userDeviceReference.orderByChild("token")
                .equalTo(userDeviceToken)
                .once("value").then(
                         function(snapshot){
                            return { status : true, message :"The read User by token succeeded", data : snapshot.val()};
                            userDeviceReference.off("value");
                         },
                         function(errorObject){
                            console.log("The read user device by token failed: " + errorObject.code);
                            return { status : false, message : "The read user device by token failed: " + errorObject.code };
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
    getUserDeviceByUserId : async function(userId) {
        var userDeviceReference = firebase.database().ref("/userDevices");
        try {
              return await userDeviceReference.orderByChild("user_id")
                .equalTo(userId)
                .once('value').then(
                    function(snapshot){
                        if (snapshot.val()) {
                            return { status : true, message :"The read userDevices succeeded", data : snapshot.val()};
                        }
                        return { status : false, message : "The read userDevices failed", data: null };
                        userDeviceReference.off("value");
                    },
                    function(errorObject){
                        console.log("The read failed: " + errorObject.code);
                        return { status : false, message : "The read failed: " + errorObject.code, data: null };
                    }
              );
        }catch (e) {
            throw Error(e.message);
        }
    },

    generateUUIDByUserDeviceId : async function (userDeviceId) {
        var newUuid = uuidv4();
        var referencePath = '/userDevices/'+userDeviceId+'/';
        var userDeviceReference = firebase.database().ref(referencePath);
        await userDeviceReference.update({"token" : newUuid, "latest" : Math.floor(Date.now()/1000)});
        return newUuid;
    },

    getUserDeviceByUUID : async function (uuid) {
        var userDeviceReference = firebase.database().ref("/userDevices");
        try {
             return await userDeviceReference.orderByChild("token")
                .equalTo(uuid)
                .once('value').then(
                    function(snapshot){
                        if (snapshot.val()) {
                            return { status : true, message :"The read UUID succeeded", data : snapshot.val()};
                        }
                        return { status : false, message : "The read UUID failed", data: null };
                        userDeviceReference.off("value");
                    },
                    function(errorObject){
                        console.log("The read failed: " + errorObject.code);
                        return { status : false, message : "The read failed: " + errorObject.code, data: null };
                    }
              );
        }catch (e) {
            throw Error(e.message);
        }
    },

    // logout : async function (userDeviceUuid) {
    //     try {
    //          var getUserDevice = await module.exports.getUserDeviceByUUID(userDeviceUuid); //note
    //          console.log(getUserDevice.status);
    //          if (!getUserDevice.status && !getUserDevice.data) {
    //             return { status: false, message: 'Uuid not exist.' };
    //          }
    //          var userDeviceData = getUserDevice.data;
    //          var userDeviceContent = userDeviceData[Object.keys(userDeviceData)[0]];
    //          var userDeviceId = userDeviceContent.userDevice_id;
    //
    //          var referencePath = '/userDevices/'+userDeviceId+'/';
    //          var userDeviceReference = firebase.database().ref(referencePath);
    //          await userDeviceReference.update({"token" : '', "latest" : Math.floor(Date.now()/1000)});
    //
    //          return { status: true, message: 'Logout Successfully.'};
    //     }catch (e) {
    //         throw Error(e.message);
    //         return { status : false, message: 'Logout failed'};
    //     }
    // },
}

var firebase = require('firebase');

module.exports = {
    get_list : async function() {
        var smarthomeUserReference = firebase.database().ref("/smarthomeUsers/");
        try {
              return await smarthomeUserReference.once("value").then(
                         function(snapshot){
                            return { status : true, message :"The read succeeded", data : snapshot.val()};
                            smarthomeUserReference.off("value");
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

    add_smarthomeUser : async function(smarthomeUserData, smarthomeUser_id) {
        var referencePath = '/smarthomeUsers/'+smarthomeUser_id+'/';
        var smarthomeUserReference = firebase.database().ref(referencePath);
        try {
            return await smarthomeUserReference.set(smarthomeUserData).then(
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
    smarthomeUser_by_id : async function(smarthomeUserId) {
        var smarthomeUserReference = firebase.database().ref("/smarthomeUsers/"+ smarthomeUserId);
        try {
              return await smarthomeUserReference.once("value").then(
                         function(snapshot){
                            return { status : true, message :"The read succeeded", data : snapshot.val()};
                            smarthomeUserReference.off("value");
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
    update_smarthomeUser : async function(smarthomeUserId, smarthomeUserData) {
        var smarthomeUserReference = firebase.database().ref("/smarthomeUsers/"+ smarthomeUserId);
        try {
            return await smarthomeUserReference.update(smarthomeUserData).then(
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
    delete_smarthomeUser : async function(smarthomeUserId) {
        var smarthomeUserReference = firebase.database().ref("/smarthomeUsers/"+ smarthomeUserId);
        try {
            return await smarthomeUserReference.remove().then(
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
    getSmartHomeUserByUserId : async function(userId) {
        var smartHomeUserReference = firebase.database().ref("/smarthomeUsers");
        try {
              return await smartHomeUserReference.orderByChild("user_id")
                .equalTo(userId)
                .once('value').then(
                    function(snapshot){
                        if (snapshot.val()) {
                            return { status : true, message :"The read smarthomeUsers succeeded", data : snapshot.val()};
                        }
                        return { status : false, message : "The read smarthomeUsers failed", data: null };
                        smartHomeUserReference.off("value");
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
    getSmartHomeUserBySmartHomeId : async function(smarthomeId) {
        var smartHomeUserReference = firebase.database().ref("/smarthomeUsers");
        try {
              return await smartHomeUserReference.orderByChild("smarthome_id")
                .equalTo(smarthomeId)
                .once('value').then(
                    function(snapshot){
                        if (snapshot.val()) {
                            return { status : true, message :"The read smarthomeUsers succeeded", data : snapshot.val()};
                        }
                        return { status : false, message : "The read smarthomeUsers failed", data: null };
                        smartHomeUserReference.off("value");
                    },
                    function(errorObject){
                        console.log("The read failed: " + errorObject.code);
                        return { status : false, message : "The read failed: " + errorObject.code, data: null };
                    }
              );
        }catch (e) {
            throw Error(e.message);
        }
    }
}

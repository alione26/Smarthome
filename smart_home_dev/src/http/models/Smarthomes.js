var firebase = require('firebase');

module.exports = {
    get_list : async function() {
        var smarthomeReference = firebase.database().ref("/smarthomes/");
        try {
              return await smarthomeReference.once("value").then(
                         function(snapshot){
                            return { status : true, message :"The read succeeded", data : snapshot.val()};
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

    add_smarthome : async function(smarthomeData, smarthome_id) {
        var referencePath = '/smarthomes/'+smarthome_id+'/';
        var smarthomeReference = firebase.database().ref(referencePath);
        try {
            return await smarthomeReference.set(smarthomeData).then(
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
    smarthome_by_id : async function(smarthomeId) {
        var smarthomeReference = firebase.database().ref("/smarthomes/"+ smarthomeId);
        try {
              return await smarthomeReference.once("value").then(
                         function(snapshot){
                            return { status : true, message :"The read succeeded", data : snapshot.val()};
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
    update_smarthome : async function(smarthomeId, smarthomeData) {
        var smarthomeReference = firebase.database().ref("/smarthomes/"+ smarthomeId);
        try {
            return await smarthomeReference.update(smarthomeData).then(
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
    delete_smarthome : async function(smarthomeId) {
        var smarthomeReference = firebase.database().ref("/smarthomes/"+ smarthomeId);
        try {
            return await smarthomeReference.remove().then(
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

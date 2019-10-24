const uuidv4 = require('uuid/v4');
const bcrypt = require('bcryptjs');
var firebase = require('firebase');
var userDevice = require('./UserDevices');

function hashPassword(plaintextPassword) {
    var salt = bcrypt.genSaltSync(10);
    return bcrypt.hashSync(plaintextPassword, salt);
}

function comparePassword(plaintextPassword, hashPassword) {
    return bcrypt.compareSync(plaintextPassword, hashPassword);
}

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
    user_by_id : async function(userId) {
        var userReference = firebase.database().ref("/users/"+ userId);
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
    },
    update_user : async function(userId, userData) {
        var userReference = firebase.database().ref("/users/"+ userId);
        try {
            return await userReference.update(userData).then(
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
    delete_user : async function(userId) {
        var userReference = firebase.database().ref("/users/"+ userId);
        try {
            return await userReference.remove().then(
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

    register : async function(userData) {
        userData.password = hashPassword(userData.password);
        userData.created_at = Math.floor(Date.now()/1000);
        userData.updated_at = Math.floor(Date.now()/1000);

        var referencePath = '/users/'+userData.user_id+'/';
        var userReference = firebase.database().ref(referencePath);
        try {
            return await userReference.set(userData).then(
                    function(error) {
                        var response = null;
                        if (error) {
                            response =  { status: false, message: "Data could not be saved." + error, data: null };
                        }
                        else {
                            response =  { status: true, message: "Data saved successfully.", data: null };
                        }
                        return response;
                    });
        } catch (e) {
            throw Error(e.message);
        }
    },
    login : async function(loginData, userData) {
         var userContent = userData[Object.keys(userData)[0]]; //note
         var userPassword = userContent.password;
         var passwordsMatch = comparePassword(loginData.password, userPassword);
         if(!passwordsMatch) {
            return { status: false, message: 'Invalid email & password.' };
         }
         return {status : true, message : 'Login successfully', user : userContent};
    },

    getUserByEmail : async function(email) {
        var userReference = firebase.database().ref("/users");
        try {
              return await userReference.orderByChild("email")
                .equalTo(email)
                .once('value').then(
                    function(snapshot){
                        return { status : true, message :"The read succeeded", data : snapshot.val()};
                        userReference.off("value");
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
    //add logout : 17-10-2019
    logout : async function (userDeviceUuid) {
        try {
             var getUserDevice = await userDevice.getUserDeviceByUUID(userDeviceUuid);
             console.log(getUserDevice.status);
             if (!getUserDevice.status && !getUserDevice.data) {
                return { status: false, message: 'Uuid not exist.' };
             }
             var userDeviceData = getUserDevice.data;
             var userDeviceContent = userDeviceData[Object.keys(userDeviceData)[0]];
             var userDeviceId = userDeviceContent.userDevice_id;

             var referencePath = '/userDevices/'+userDeviceId+'/';
             var userDeviceReference = firebase.database().ref(referencePath);
             await userDeviceReference.update({"token" : '', "latest" : Math.floor(Date.now()/1000)});

             return { status: true, message: 'Logout Successfully.'};
        }catch (e) {
            throw Error(e.message);
            return { status : false, message: 'Logout failed'};
        }
    },

}

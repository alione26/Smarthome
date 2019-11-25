const uuidv4 = require('uuid/v4');
const bcrypt = require('bcryptjs');
var firebase = require('firebase');
var adminDevice = require('./AdminDevices');

function hashPassword(plaintextPassword) {
    var salt = bcrypt.genSaltSync(10);
    return bcrypt.hashSync(plaintextPassword, salt);
}

function comparePassword(plaintextPassword, hashPassword) {
    return bcrypt.compareSync(plaintextPassword, hashPassword);
}

module.exports = {
  add_admin : async function(adminData, admin_id) {
      adminData.password = hashPassword(adminData.password);
      adminData.created_at = Math.floor(Date.now() / 1000);
      adminData.updated_at = Math.floor(Date.now() / 1000);
      var referencePath = '/admins/'+admin_id+'/';
      var adminReference = firebase.database().ref(referencePath);
      try {
          return await adminReference.set(adminData).then(
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
  admin_by_id : async function(adminId) {
      var adminReference = firebase.database().ref("/admins/"+ adminId);
      try {
            return await adminReference.once("value").then(
                       function(snapshot){
                          return { status : true, message :"The read-admin by adminId succeeded", data : snapshot.val()};
                          adminReference.off("value");
                       },
                       function(errorObject){
                          console.log("The read failed: " + errorObject.code);
                          return { status : false, message : "The read-admin  by adminId failed: " + errorObject.code };
                       },
            );
      }catch (e) {
          throw Error(e.message);
      }
  },
  adminLogin : async function(adminLoginData, adminData) {
       var adminContent = adminData[Object.keys(adminData)[0]]; //note
       var adminPassword = adminContent.password;
       var adminPasswordsMatch = comparePassword(adminLoginData.password, adminPassword);
       if(!adminPasswordsMatch) {
          return { status: false, message: 'Invalid email & password.' };
       }
       return {status : true, message : 'Admin Login successfully', admin : adminContent};
  },
  adminLogout : async function (adminDeviceUuid) {
      try {
           var getAdminDevice = await adminDevice.getAdminDeviceByUUID(adminDeviceUuid);
           //console.log(getAdminDevice.status);
           if (!getAdminDevice.status && !getAdminDevice.data) {
              return { status: false, message: 'Admin-Uuid not exist.' };
           }
           var adminDeviceData = getAdminDevice.data;
           var adminDeviceContent = adminDeviceData[Object.keys(adminDeviceData)[0]];
           var adminDeviceId = adminDeviceContent.adminDevice_id;

           var referencePath = '/adminDevices/'+adminDeviceId+'/';
           var adminDeviceReference = firebase.database().ref(referencePath);
           await adminDeviceReference.update({"token" : '', "latest" : Math.floor(Date.now()/1000)});

           return { status: true, message: 'Admin-Logout Successfully.'};
      }catch (e) {
          throw Error(e.message);
          return { status : false, message: 'Admin-Logout failed'};
      }
  },

  getAdminByEmail : async function(email) {
      var adminReference = firebase.database().ref("/admins");
      try {
            return await adminReference.orderByChild("email")
              .equalTo(email)
              .once('value').then(
                  function(snapshot){
                      return { status : true, message :"The read-admin by Email succeeded", data : snapshot.val()};
                      adminReference.off("value");
                  },
                  function(errorObject){
                      console.log("The read failed: " + errorObject.code);
                      return { status : false, message : "The read-admin by Email failed: " + errorObject.code, data: null };
                  }
            );
      }catch (e) {
          throw Error(e.message);
      }
  },
}

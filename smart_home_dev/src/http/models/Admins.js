const uuidv4 = require('uuid/v4');
const bcrypt = require('bcryptjs');
var firebase = require('firebase');
var adminDevice = require('./AdminDevices');
var smarthomeUser = require('./smartHomeUsers');
var users = require('./Users');

function hashPassword(plaintextPassword) {
    var salt = bcrypt.genSaltSync(10);
    return bcrypt.hashSync(plaintextPassword, salt);
}

function comparePassword(plaintextPassword, hashPassword) {
    return bcrypt.compareSync(plaintextPassword, hashPassword);
}
function updateDate() {
  let d = new Date();

  let date = d.getDate();
  let month = d.getMonth() + 1; // Since getMonth() returns month from 0-11 not 1-12
  let year = d.getFullYear();

  let update_date = year + "-" + month + "-" + date;
  return update_date;
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
  change_setting_user: async function(userDataForSetting, userHadSmarthomeUser, smarthomeUserData) {
    if (userDataForSetting.current_active_status == userDataForSetting.new_active_status) {
      if (userDataForSetting.current_active_status) {
        if (!(userDataForSetting.current_smarthome_id == userDataForSetting.new_smarthome_id)) {
          smarthomeUserData.smarthome_id = userDataForSetting.new_smarthome_id;
          smarthomeUserData.updated_at = updateDate();
          console.log(smarthomeUserData);
          var updateSmarthomeUser = await smarthomeUser.update_smarthomeUser(smarthomeUserData.smarthomeUser_id, smarthomeUserData);
          if (!updateSmarthomeUser.status) {
            return {
              status: false,
              message: updateSmarthomeUser.message
            };
          }
          return {
            status: true,
            message: updateSmarthomeUser.message
          };
        }
      }
      return {
        status: false,
        message: "Bạn chưa kích hoạt User!"
      };
    } else if (!userDataForSetting.current_active_status && userDataForSetting.new_active_status) {
      console.log('hhhhhhhhhhhh');
      var userData = userDataForSetting.current_user_data;
      userData.active = userDataForSetting.new_active_status;
      userData.updated_at = updateDate();
      delete userData.smarthome_id;
      delete userData.smarthome_name;
      var updateUserData = await users.update_user(userData.user_id, userData);
      if (!updateUserData.status) {
        return {
          status: false,
          message: updateUserData.message
        };
      }
      if (userHadSmarthomeUser) {
        if (!(userDataForSetting.current_smarthome_id == userDataForSetting.new_smarthome_id)) {
          smarthomeUserData.smarthome_id = userDataForSetting.new_smarthome_id;
          smarthomeUserData.updated_at = updateDate();
          console.log(smarthomeUserData);
          var updateSmarthomeUser = await smarthomeUser.update_smarthomeUser(smarthomeUserData.smarthomeUser_id, smarthomeUserData);
          if (!updateSmarthomeUser.status) {
            return {
              status: false,
              message: updateSmarthomeUser.message
            };
          }
          return {
            status: true,
            message: updateSmarthomeUser.message
          };
        }
        return {
          status: true,
          message: updateUserData.message
        };
      } else {
        // let d = new Date();
        //
        // let date = d.getDate();
        // let month = d.getMonth() + 1; // Since getMonth() returns month from 0-11 not 1-12
        // let year = d.getFullYear();
        //
        // let created_at = year + "-" + month + "-" + date;
        var updated_date = updateDate();
        var smarthomeUser_id = uuidv4();
        smarthomeUserData = {
          smarthomeUser_id: smarthomeUser_id,
          user_id: userDataForSetting.user_id,
          smarthome_id: userDataForSetting.new_smarthome_id,
          finger_id: '',
          rfid_id: '',
          updated_at: updated_date,
          created_at: updated_date
        };
        console.log('create_smarthomeUser');
        var createNewSmarthomeUser = await smarthomeUser.add_smarthomeUser(smarthomeUserData, smarthomeUser_id);
        if (!createNewSmarthomeUser.status) {
          return {
            status: false,
            message: createNewSmarthomeUser.message
          };
        }
        return {
          status: true,
          message: createNewSmarthomeUser.message
        };
      }
    } else {
      var userData = userDataForSetting.current_user_data;
      userData.active = userDataForSetting.new_active_status;
      userData.updated_at =updateDate();
      delete userData.smarthome_id;
      delete userData.smarthome_name;
      var updateUserData = await users.update_user(userData.user_id, userData);
      if (!updateUserData.status) {
        return {
          status: false,
          message: updateUserData.message
        };
      }
      return {
        status: true,
        message: updateUserData.message
      };
    }
  }
  }

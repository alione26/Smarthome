var Admins = require("./../models/Admins");

module.exports = {

    add_admin : async function(adminData, admin_id) {
        return await Admins.add_admin(adminData, admin_id);
    },
    admin_by_id : async function(adminId) {
        return await Admins.admin_by_id(adminId);
    },
    adminLogin : async function(adminLoginData) {
        try {
            var getAdmin = await Admins.getAdminByEmail(adminLoginData.email);
            if (getAdmin.status && getAdmin.data) {
                var AdminData = getAdmin.data;
                var adminContent = AdminData[Object.keys(AdminData)[0]];
              //if (adminContent.active) {
                var admin = await Admins.adminLogin(adminLoginData, AdminData);
                if (admin.status) {
                return {status : true, message : admin.message, admin : admin.admin};
                }
                return {status : false, message : admin.message};
              //}
            //return {status : false, message : 'Account is not Activated'};
          }
            return {status : false, message : 'Email not exist'};
        }catch(e) {
            throw Error(e.message);
        }
    },
    adminLogout: async function(uuid) {
        try {
            return await Admins.adminLogout(uuid);
        } catch (e) {
            throw Error(e.message);
        }
    },
    change_setting_user: async function(userDataForSetting, userHadSmarthomeUser, smarthomeUserData){
      try {
        return await Admins.change_setting_user(userDataForSetting, userHadSmarthomeUser, smarthomeUserData);
      }catch(e) {
        throw Error(e.message);
      }
    }
}

var smarthomeUser = require("./../models/SmarthomeUsers");

module.exports = {

    add_smarthomeUser : async function(smarthomeUserData, smarthomeUser_id) {
        return await smarthomeUser.add_smarthomeUser(smarthomeUserData, smarthomeUser_id);
    },
    get_list : async function() {
        return await smarthomeUser.get_list();
    },
    smarthomeUser_by_id : async function(smarthomeUserId) {
        return await smarthomeUser.smarthomeUser_by_id(smarthomeUserId);
    },
    update_smarthomeUser : async function(smarthomeUserId,smarthomeUserData) {
        return await smarthomeUser.update_smarthomeUser(smarthomeUserId,smarthomeUserData);
    },
    delete_smarthomeUser : async function(smarthomeUserId) {
        return await smarthomeUser.delete_smarthomeUser(smarthomeUserId);
    },
}

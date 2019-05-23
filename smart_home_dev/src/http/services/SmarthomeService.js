var smarthome = require("./../models/Smarthomes");

module.exports = {

    add_smarthome : async function(smarthomeData, smarthome_id) {
        return await smarthome.add_smarthome(smarthomeData, smarthome_id);
    },
    get_list : async function() {
        return await smarthome.get_list();
    },
    smarthome_by_id : async function(smarthomeId) {
        return await smarthome.smarthome_by_id(smarthomeId);
    },
    update_smarthome : async function(smarthomeId,smarthomeData) {
        return await smarthome.update_smarthome(smarthomeId,smarthomeData);
    },
    delete_smarthome : async function(smarthomeId) {
        return await smarthome.delete_smarthome(smarthomeId);
    },
}

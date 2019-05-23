var smarthomeDevice = require("./../models/SmarthomeDevices");

module.exports = {

    add_smarthomeDevice : async function(smarthomeDeviceData, smarthomeDevice_id) {
        return await smarthomeDevice.add_smarthomeDevice(smarthomeDeviceData, smarthomeDevice_id);
    },
    get_list : async function() {
        return await smarthomeDevice.get_list();
    },
    smarthomeDevice_by_id : async function(smarthomeDeviceId) {
        return await smarthomeDevice.smarthomeDevice_by_id(smarthomeDeviceId);
    },
    update_smarthomeDevice : async function(smarthomeDeviceId,smarthomeDeviceData) {
        return await smarthomeDevice.update_smarthomeDevice(smarthomeDeviceId,smarthomeDeviceData);
    },
    delete_smarthomeDevice : async function(smarthomeDeviceId) {
        return await smarthomeDevice.delete_smarthomeDevice(smarthomeDeviceId);
    },
}

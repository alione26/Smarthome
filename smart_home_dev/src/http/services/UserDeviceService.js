var userDevice = require("./../models/UserDevices");

module.exports = {

    add_userDevice : async function(userDeviceData, userDevice_id) {
        return await userDevice.add_userDevice(userDeviceData, userDevice_id);
    },
    get_list : async function() {
        return await userDevice.get_list();
    },
    userDevice_by_id : async function(userDeviceId) {
        return await userDevice.userDevice_by_id(userDeviceId);
    },
    update_userDevice : async function(userDeviceId,userDeviceData) {
        return await userDevice.update_userDevice(userDeviceId,userDeviceData);
    },
    delete_userDevice : async function(userDeviceId) {
        return await userDevice.delete_userDevice(userDeviceId);
    },
}

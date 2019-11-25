var adminDevice = require("./../models/AdminDevices");

module.exports = {

    add_adminDevice : async function(adminDeviceData, adminDevice_id) {
        return await adminDevice.add_adminDevice(adminDeviceData, adminDevice_id);
    },
    getAdminDeviceByToken : async function(adminDeviceToken) {
        return await adminDevice.getAdminDeviceByUUID(adminDeviceToken);
    },
    generateUUIDByAdminDeviceId : async function (adminDeviceId) {
        try {
            return await adminDevice.generateUUIDByAdminDeviceId(adminDeviceId);
        } catch (e) {
            throw Error(e.message);
        }
    },
    adminCheckUUID : async function(uuid) {
        try {
            var getAdminDevice =  await adminDevice.getAdminDeviceByUUID(uuid);
            //console.log(getUserDevice.status);
            if (!getAdminDevice.status && !getAdminDevice.data) {
                return { status: false, message: 'Uuid-Admin not exist.' };
            }

            var adminDeviceData = getAdminDevice.data;
            var adminDeviceContent = adminDeviceData[Object.keys(adminDeviceData)[0]];
            var latestTime = Math.floor(Date.now()/1000) - parseInt(adminDeviceContent.latest);

            if (latestTime > (2 * 60 * 60)) {
                console.log('Uuid-Admin has expired. Please login again!');
                return { status: false, message: 'Uuid-Admin has expired. Please login again!' };
            }

            return { status: true, message: 'Check UUid-Admin Successfully.' };

        } catch (e) {
            throw Error(e.message);
        }
    },
}

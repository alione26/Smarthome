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
    userDevice_by_token : async function(userDeviceToken) {
        return await userDevice.userDevice_by_token(userDeviceToken);
    },
    update_userDevice : async function(userDeviceId,userDeviceData) {
        return await userDevice.update_userDevice(userDeviceId,userDeviceData);
    },
    delete_userDevice : async function(userDeviceId) {
        return await userDevice.delete_userDevice(userDeviceId);
    },

    generateUUIDByUserDeviceId : async function (userDeviceId) {
        try {
            return await userDevice.generateUUIDByUserDeviceId(userDeviceId);
        } catch (e) {
            throw Error(e.message);
        }
    },

    checkUUID : async function(uuid) {
        try {
            var getUserDevice =  await userDevice.getUserDeviceByUUID(uuid);
            //console.log(getUserDevice.status);
            if (!getUserDevice.status && !getUserDevice.data) {
                return { status: false, message: 'Uuid not exist.' };
            }

            var userDeviceData = getUserDevice.data;
            var userDeviceContent = userDeviceData[Object.keys(userDeviceData)[0]];
            var latestTime = Math.floor(Date.now()/1000) - parseInt(userDeviceContent.latest);

            if (latestTime > (2 * 60 * 60)) {
                console.log('Uuid has expired. Please login again!');
                return { status: false, message: 'Uuid has expired. Please login again!' };
            }

            return { status: true, message: 'Successfully.' };

        } catch (e) {
            throw Error(e.message);
        }
    },

    // logout: async function(uuid) {
    //     try {
    //         return await userDevice.logout(uuid);
    //     } catch (e) {
    //         throw Error(e.message);
    //     }
    // },
}

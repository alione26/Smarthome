var socketio = require('../../socketio/socketio');
var userDevice = require('../models/UserDevices');
var smartHomeUser = require('../models/SmarthomeUsers');
var smartHome = require('../models/Smarthomes');

module.exports = {
    action : async function(req, res) {
        var token = req.headers.uuid;
        var smarthome_device_id = req.body.smarthome_device_id;
        var action = req.body.action;


        var getUserDevice = await userDevice.getUserDeviceByUUID(token);
        if (!getUserDevice.status && getUserDevice.data) {
            return res.status(400).json({ success: false, message: getUserDevice.message });
        }
        var userDeviceData = getUserDevice.data;
        var userDeviceContent = userDeviceData[Object.keys(userDeviceData)[0]];
        var userId = userDeviceContent.user_id;
        console.log('userId: ', userId);

        var getSmartHomeUser = await smartHomeUser.getSmartHomeUserByUserId(userId);
        if (!getSmartHomeUser.status && !getSmartHomeUser.data) {
            return res.status(400).json({ success: false, message: getSmartHomeUser.message });
        }
        var smartHomeUserData = getSmartHomeUser.data;
        var smartHomeUserContent = smartHomeUserData[Object.keys(smartHomeUserData)[0]];
        var smarthomeId = smartHomeUserContent.smarthome_id;
        console.log('smarthomeId:', smarthomeId);

        var getSmartHome = await smartHome.getSmartHomeBySmartHomeId(smarthomeId);
        if (!getSmartHome.status && !getSmartHome.data) {
            return res.status(400).json({ success: false, message: getSmartHome.message });
        }
        var smartHomeData = getSmartHome.data;
        var smartHomeContent = smartHomeData[Object.keys(smartHomeData)[0]];
        var socketId = smartHomeContent.socketId;
        console.log('socketId:', socketId);


        var emitData = { deviceId : smarthome_device_id, action : action};
        socketio.emitMessage(socketId, emitData );
        return res.status(200).json({ success: true, message: "The action sent to..." + socketId });
    },
}

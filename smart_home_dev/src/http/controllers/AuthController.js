const uuidv4 = require('uuid/v4');
const userDeviceController = require('./UserDeviceController');
const userDevice = require('../models/UserDevices');
const userDeviceService = require('../services/UserDeviceService');
const userService = require("../services/UserService");
const emailRegexp = /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*$/;

module.exports = {
    middleware : async function (req, res, next) {
        var currentUUID =  req.headers.uuid;
        console.log(currentUUID);

        try {
            var checkUUID =  await userDeviceService.checkUUID(currentUUID);
            if (!checkUUID.status) {
                return res.status(400).json({ success: false, message: checkUUID.message });
            }

            // var checkPermission =  await userService.checkPermission(currentUUID, req.path);
            // if (!checkPermission.status) {
            //     return res.status(400).json({ success: false, message: checkPermission.message });
            // }

            next();
        } catch (e) {
            return res.status(400).json({ success: "false", message: e.message });

        }
    },

    register : async function (req, res, next) {
        var user_id = uuidv4();

        var userData = { user_id: user_id, name : req.body.name, password: req.body.password, email : req.body.email, phone : req.body.phone,
            gender : req.body.gender, date_of_birth : req.body.date_of_birth };

        if (!emailRegexp.test(userData.email)) {
            return res.status(400).json({ success: false, message: 'Email invalid.' });
        }

        var registerUser = await userService.register(userData);

        if (registerUser.status) {
            return res.status(200).json({ success: true, message: registerUser.message, data: registerUser.data });
        }
        return res.status(400).json({ success: false, message: registerUser.message, data: null});
    },

    login : async function (req, res, next) {
        var loginData = { email: req.body.email, password: req.body.password };

        if (!emailRegexp.test(loginData.email)) {
            return res.status(400).json({ success: false, message: 'Email invalid.' });
        }

        try {
            var login = await userService.login(loginData);
            console.log(login.status);
            if (!login.status) {
                
                console.log('ffhghfghhgh');
                res.status(400).json({ success: false, message: login.message });
            }

            var user = login.user;
            //console.log(user);
            var getUserDevice = await userDevice.getUserDeviceByUserId(user.user_id);
            //console.log(getUserDevice.status);
            //console.log(getUserDevice.data);
            if (getUserDevice.status) {
                var userDeviceData = getUserDevice.data;
                var userDeviceContent = userDeviceData[Object.keys(userDeviceData)[0]];
                var userDeviceId = userDeviceContent.userDevice_id;
                var uuid = await userDeviceService.generateUUIDByUserDeviceId(userDeviceId);
            }
            else {
                var uuid = uuidv4();
                await userDeviceController.new_userDevice(user.user_id, uuid);

            }
            var userData = { user_id: user.user_id, email: user.email, name: user.name, phone: user.phone, gender: user.gender, date_of_birth : user.date_of_birth , created_at: user.created_at, updated_at: user.updated_at };
            //var responseData = UserService.transformDataForDevices(req.headers['x-device'], [userData]);

            return res.status(200).set('uuid', uuid).json({ success: true, data: userData, message: login.message});
        } catch (e) {
            //return res.status(400).json({ success: false, message: e.message });
            //console.log("hdshdhdhd");
        }
    },

    logout: async function (req, res, next) {
        var currentUUID =  req.headers.uuid;
        console.log('token'+ currentUUID);

        try {
            var logoutData = await userDeviceService.logout(currentUUID);
            console.log(logoutData);

            return res.status(200).json({ success: logoutData.status, data: null, message: logoutData.message });
        } catch (e) {
            return res.status(400).json({ success: false, message: e.message });
        }
    },
}




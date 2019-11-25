const uuidv4 = require('uuid/v4');
const userDeviceController = require('./UserDeviceController');
const userDevice = require('../models/UserDevices');
const userDeviceService = require('../services/UserDeviceService');
const userService = require("../services/UserService");

const adminDeviceController = require('./AdminDeviceController');
const adminService = require("../services/AdminService");
const adminDevice = require('../models/AdminDevices');
const adminDeviceService = require('../services/AdminDeviceService');

const emailRegexp = /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*$/;

module.exports = {
    middleware : async function (req, res, next) {
        var currentUUID =  req.headers.uuid;
        console.log('currentUUID in middleware checking : ' + currentUUID);

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
    adminMiddleware : async function (req, res, next) {
        var currentUUID =  req.headers.uuid;
        console.log('currentUUID in middleware-Admin checking : ' + currentUUID);

        try {
            var adminCheckUUID =  await adminDeviceService.adminCheckUUID(currentUUID);
            //console.log(adminCheckUUID.status);
            if (!adminCheckUUID.status) {
                return res.status(400).json({ success: false, message: adminCheckUUID.message });
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
        var active = false;
        var gender = '';
        var phone = '';
        var date_of_birth = '';

        var userData = { user_id: user_id, name : req.body.name, password: req.body.password, email : req.body.email, phone : phone,
            gender : gender, date_of_birth : date_of_birth, active : active };

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
            if (!login.status) {
                return res.status(400).json({ success: false, message: login.message });
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
            return res.status(400).json({ success: false, message: e.message });
        }
    },

    adminLogin : async function (req, res, next) {
        var adminLoginData = { email: req.body.email, password: req.body.password };

        if (!emailRegexp.test(adminLoginData.email)) {
            return res.status(400).json({ success: false, message: 'Email invalid.' });
        }

        try {
            var adminLogin = await adminService.adminLogin(adminLoginData); // add admin login
            if (!adminLogin.status) {
                return res.status(400).json({ success: false, message: adminLogin.message });
            }

            var admin = adminLogin.admin;
            //console.log(admin);
            var getAdminDevice = await adminDevice.getAdminDeviceByAdminId(admin.admin_id);
            //console.log(getAdminDevice.status);
            //console.log(getAdminDevice.data);
            if (getAdminDevice.status) {
                var adminDeviceData = getAdminDevice.data;
                var adminDeviceContent = adminDeviceData[Object.keys(adminDeviceData)[0]];
                var adminDeviceId = adminDeviceContent.adminDevice_id;
                var uuid = await adminDeviceService.generateUUIDByAdminDeviceId(adminDeviceId);
            }
            else {
                var uuid = uuidv4();
                var newAdmin = await adminDeviceController.new_adminDevice(admin.admin_id, uuid);
                console.log("new adminDevice response:", newAdmin.success);
            }
            var adminData = { admin_id: admin.admin_id, email: admin.email, name: admin.name, phone: admin.phone,
            gender: admin.gender, date_of_birth : admin.date_of_birth , created_at: admin.created_at, updated_at: admin.updated_at };
            //var responseData = UserService.transformDataForDevices(req.headers['x-device'], [userData]);

            return res.status(200).set('uuid', uuid).json({ success: true, data: adminData, message: adminLogin.message});
        } catch (e) {
            return res.status(400).json({ success: false, message: e.message });
        }
    },

    logout: async function (req, res, next) {
        var currentUUID =  req.headers.uuid;

        try {
            var logoutData = await userService.logout(currentUUID);
            console.log(logoutData);

            return res.status(200).json({ success: logoutData.status, data: null, message: logoutData.message });
        } catch (e) {
            return res.status(400).json({ success: false, message: e.message });
        }
    },
    adminLogout: async function (req, res, next) {
        var currentUUID =  req.headers.uuid;
        console.log('Uuid-Admin is ready to logout:', currentUUID);

        try {
            var adminLogoutData = await adminService.adminLogout(currentUUID);
            console.log(adminLogoutData);

            return res.status(200).json({ success: adminLogoutData.status, data: null, message: adminLogoutData.message });
        } catch (e) {
            return res.status(400).json({ success: false, message: e.message });
        }
    },
}

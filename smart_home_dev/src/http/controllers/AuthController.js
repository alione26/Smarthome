const uuidv4 = require('uuid/v4');

const userService = require("../services/UserService");
const emailRegexp = /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*$/;

module.exports = {
    middleware : async function (req, res, next) {
        var currentUUID =  req.headers.uuid;

        try {
            var checkUUID =  await UserService.checkUUID(currentUUID);
            if (!checkUUID.status) {
                return res.status(400).json({ success: false, message: checkUUID.message });
            }

            var checkPermission =  await UserService.checkPermission(currentUUID, req.path);
            if (!checkPermission.status) {
                return res.status(400).json({ success: false, message: checkPermission.message });
            }

            next();
        } catch (e) {
            return res.status(400).json({ success: false, message: e.message });
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

    /*login : async function (req, res, next) {
        var loginData = { email: req.body.email, password: req.body.password };

        if (!emailRegexp.test(loginData.email)) {
            return res.status(400).json({ success: false, message: 'Email invalid.' });
        }

        try {
            var login = await UserService.login(loginData);
            if (!login.status) {
                return res.status(400).json({ success: false, message: login.message });
            }

            var user = login.user;
            var uuid = await UserService.generateUUIDByEmail(user.email);
            var userData = { id: user.id, email: user.email, name: user.name, created: user.created, latest: user.latest };
            var responseData = UserService.transformDataForDevices(req.headers['x-device'], [userData]);

            return res.status(200).set('uuid', uuid).json({ success: true, data: responseData, message: "Succesfully" });
        } catch (e) {
            return res.status(400).json({ success: false, message: e.message });
        }
    },

    logout: async function (req, res, next) {
        var currentUUID =  req.headers.uuid;

        try {
            UserService.logout(currentUUID);

            return res.status(200).json({ success: true, data: null, message: "Succesfully" });
        } catch (e) {
            return res.status(400).json({ success: false, message: e.message });
        }
    }*/
}




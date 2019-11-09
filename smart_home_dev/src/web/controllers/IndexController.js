const axios = require('axios');
const constants = require('../constants');

const viewPath = '../src/web/views';

module.exports = {
    index: async function (req, res, next) {
        res.render(viewPath + '/index.ejs', { page: 'Home', menuId: 'home' });
    },
    error: async function (req, res, next) {
        res.render(viewPath + '/error.ejs', { page: 'Error', menuId: '', message: 'Empty response.' });
    },
    loginPage: async function (req, res, next) {
        res.render(viewPath + '/login/index.ejs', { page: 'Login', menuId: 'login' });
    },
    signUp: async function (req, res, next) {
        res.render(viewPath + '/login/SignUp.ejs', { page: 'SignUp', menuId: 'signUp' });

    },
    logOut: async function (req, res, next) {
        //console.log('hihihi');
        try {
            var response = await axios.get(constants.API_URI + '/auth/logout', { 'headers': { 'uuid': req.session.uuid } });
            if (!response.data.success) {
                return res.status(400).json({ success: response.data.success });
            }
            req.session.signed = !response.data.success;
            console.log('check-logout :' + response.data.success);
            return res.status(200).json({ success: response.data.success });
        } catch (error) {
            console.log(error);
        }
    },
    authencation: async function (req, res, next) {
        var email = req.body.user;
        var password = req.body.password;
        var response = await axios.post(constants.API_URI + '/auth/login', {
            email: email,
            password: password
        })
            .then(function (response) {
                if (!response.data.success) {
                    res.status(400).json({ success: false, message: response.data.message });
                }
                req.session.uuid = response.headers.uuid;
                req.session.signed = true;
                //req.session.save();
                console.log('signed :' + req.session.signed);
                res.status(200).set('uuid', response.headers.uuid).json({ success: true, message: response.data.message });
            })
            .catch(function (error) {
                //console.log(error);
                res.status(400).json({ success: false, message: error.message });
            });
    },
    smartHomes: async function (req, res, next) {
        try {

            var ss = req.session;
            //console.log(Object.keys(ss).length);

            if (ss == undefined || !(Object.keys(ss).length - 1)) {
                return res.redirect(constants.API_URI + '/loginPage');
            }

            var response = await axios.get(constants.API_URI + '/smarthome/get_list', { headers: { 'uuid': ss.uuid } });
            if (!response.data.success) {
                res.redirect(constants.API_URI + '/error');
            }

            res.render(viewPath + '/smart-homes/index.ejs', { page: 'SMART HOMES', menuId: 'smart_homes', smartHomeList: response.data.data });
        } catch (error) {
            //console.error(error);
            res.redirect(constants.API_URI + '/loginPage');
        }
    },
    showAuthButton: async function (req, res, next) {
        try {
            var ss = req.session;
            //console.log(Object.keys(ss).length);

            if (ss == undefined || !(Object.keys(ss).length - 1)) {
                // return res.redirect(constants.API_URI + '/error');
                console.log('uuid undefinded');
            }

            // var response = await axios.get(constants.API_URI + '/checkSignedIn', { headers: { 'uuid': ss.uuid } });
            // console.log(response.data.success + 'middleware');
            return res.status(200).json({ signed : ss.signed});
        } catch (error) {
            console.log(error);
        }
    },
    detail: async function (req, res, next) {
        try {
            var ss = req.session;
            //console.log(Object.keys(ss).length);

            if (ss == undefined || !(Object.keys(ss).length - 1)) {
                return res.redirect(constants.API_URI + '/loginPage');
            }

            var smartHomeId = req.params['id'];

            var smartHome = await axios.get(constants.API_URI + '/smarthome/get_by_id/' + smartHomeId, { headers: { 'uuid': ss.uuid } });
            if (!smartHome.data.success) {
                res.redirect(constants.API_URI + '/loginPage');
            }

            var smartHomeDevices = await axios.get(constants.API_URI + '/smarthome_device/' + smartHomeId, { headers: { 'uuid': ss.uuid } });
            if (!smartHomeDevices.data.success) {
                res.redirect(constants.API_URI + '/loginPage');
            }

            res.render(viewPath + '/smart-homes/detail.ejs', { page: 'SMART HOME DEVICES', menuId: 'smart_homes', smartHome: smartHome.data.data, smartHomeDevices: smartHomeDevices.data.data });
        } catch (error) {
            //console.error(error);
            res.redirect(constants.API_URI + '/loginPage');
        }
    },
    smartHomeUsers: async function (req, res, next) {
        try {
            var smarthomeDevice_id = req.params['id'];

            var response = await axios.get(constants.API_URI + '/smarthome_device/get_by_id/' + smarthomeDevice_id);
            if (!response.data.success) {
                res.redirect(constants.API_URI + '/error');
            }
            var smartHomeDevice = response.data.data;

            var response = await axios.get(constants.API_URI + '/smarthome_user/getBySmarthomeId/' + smartHomeDevice.smarthome_id);
            if (!response.data.success) {
                res.redirect(constants.API_URI + '/error');
            }

            var smartHomeUser = response.data.data;

            res.render(viewPath + '/fingers/users.ejs', { page: 'FINGER USERS', menuId: 'smart_homes', smartHomeUser: smartHomeUser, smartHomeDevice: smartHomeDevice });
        } catch (error) {
            console.error(error);
        }
    },
    doAction: async function (req, res, next) {
        try {
            var smarthomeDevice_id = req.body.smarthomeDevice_id;
            var smarthome_id = req.body.smarthome_id;
            var action = req.body.action;

            // var response = await axios.get(constants.API_URI + '/smarthome/get_by_id/' + smarthome_id);
            // if (!response.data.success) {
            //     res.redirect(constants.API_URI + '/error');
            // }
            // var smartHome = response.data.data;

            var response = await axios.get(constants.API_URI + '/smarthome_device/get_by_id/' + smarthomeDevice_id);
            if (!response.data.success) {
                res.redirect(constants.API_URI + '/error');
            }
            var smartHomeDevice = response.data.data;

            var updateSmartHomeDevice = axios({
                method: 'post',
                url: constants.API_URI + '/smarthome_device/update/' + smarthomeDevice_id,
                data: {
                    smarthome_id: smartHomeDevice.smarthome_id,
                    series_number: smartHomeDevice.series_number,
                    machine_type: smartHomeDevice.machine_type,
                    status: action,
                    updated_at: smartHomeDevice.updated_at,
                    created_at: smartHomeDevice.created_at,
                    name: smartHomeDevice.name,
                    data: smartHomeDevice.data
                }
            });

            var actionData = {
                smarthome_device_id: smarthomeDevice_id,
                action: action == 'active' ? 'on' : 'off'
            };

            var doAction = axios({
                headers: { 'uuid': constants.DEMO_USER_TOKEN },
                method: 'post',
                url: constants.API_URI + '/action',
                data: actionData
            });

            return res.status(200).json({ success: true, message: 'Successfully' });

        } catch (error) {
            return res.status(400).json({ success: false, message: error });
        }
    },
    fingerAction: async function (req, res, next) {
        try {
            var smarthomeDevice_id = req.body.smarthomeDevice_id;
            var smarthomeUser_id = req.body.smarthomeUser_id;
            var action = req.body.action;

            var response = await axios.get(constants.API_URI + '/smarthome_user/get_by_id/' + smarthomeUser_id);
            if (!response.data.success) {
                res.redirect(constants.API_URI + '/error');
            }
            var smarthomeUser = response.data.data;

            var updateSmartHomeUser = axios({
                method: 'post',
                url: constants.API_URI + '/smarthome_user/update/' + smarthomeUser_id,
                data: {
                    smarthome_id: smarthomeUser.smarthome_id,
                    finger_id: 'Updating',
                    updated_at: smarthomeUser.updated_at,
                    created_at: smarthomeUser.created_at,
                    user_id: smarthomeUser.user_id,
                    rfid_id: smarthomeUser.rfid_id
                }
            });

            var actionData = {
                smarthome_device_id: smarthomeDevice_id,
                finger_id: smarthomeUser.finger_id,
                action: action
            };

            var doAction = axios({
                headers: { 'uuid': constants.DEMO_USER_TOKEN },
                method: 'post',
                url: constants.API_URI + '/action',
                data: actionData
            });

            return res.status(200).json({ success: true, message: 'Successfully' });

        } catch (error) {
            return res.status(400).json({ success: false, message: error });
        }
    },
    webHook: async function (req, res, next) {
        try {
            const data = req.body;
            console.log(data);

            return res.json({
                speech: 'Something went wrong!',
                displayText: 'Something went wrong!',
                source: 'get-movie-details'
            });
        } catch (error) {
            console.error(error);
        }
    }
}

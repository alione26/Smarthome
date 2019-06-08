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
    smartHomes: async function (req, res, next) {
        try {
            var response = await axios.get(constants.API_URI + '/smarthome/get_list');

            if (!response.data.success) {
                res.redirect(constants.API_URI + '/error');
            }

            res.render(viewPath + '/smart-homes/index.ejs', { page: 'SMART HOMES', menuId: 'smart_homes', smartHomeList: response.data.data });
        } catch (error) {
            console.error(error);
        }
    },
    detail: async function (req, res, next) {
        try {
            var smartHomeId = req.params['id'];

            var smartHome = await axios.get(constants.API_URI + '/smarthome/get_by_id/' + smartHomeId);
            if (!smartHome.data.success) {
                res.redirect(constants.API_URI + '/error');
            }

            var smartHomeDevices = await axios.get(constants.API_URI + '/smarthome_device/' + smartHomeId);
            if (!smartHomeDevices.data.success) {
                res.redirect(constants.API_URI + '/error');
            }

            res.render(viewPath + '/smart-homes/detail.ejs', { page: 'SMART HOME DETAIL', menuId: 'smart_homes', smartHome: smartHome.data.data, smartHomeDevices: smartHomeDevices.data.data });
        } catch (error) {
            console.error(error);
        }
    },
    smartHomeUsers: async function (req, res, next) {
        try {
            var smartHomeId = req.params['id'];

            var smartHome = await axios.get(constants.API_URI + '/smarthome/get_by_id/' + smartHomeId);
            if (!smartHome.data.success) {
                res.redirect(constants.API_URI + '/error');
            }

            var smartHomeDevices = await axios.get(constants.API_URI + '/smarthome_device/' + smartHomeId);
            if (!smartHomeDevices.data.success) {
                res.redirect(constants.API_URI + '/error');
            }

            res.render(viewPath + '/fingers/users.ejs', { page: 'FINGER USERS', menuId: 'smart_homes', smartHome: smartHome.data.data, smartHomeDevices: smartHomeDevices.data.data });
        } catch (error) {
            console.error(error);
        }
    },
    doAction: async function (req, res, next) {
        try {
            var smarthomeDevice_id = req.body.smarthomeDevice_id;
            var smarthome_id = req.body.smarthome_id;
            var action = req.body.action;

            return res.status(200).json({ success: true, message: 'Successfully' });
        
        } catch (error) {
            return res.status(400).json({ success: false, message: error});
        }
    }
}
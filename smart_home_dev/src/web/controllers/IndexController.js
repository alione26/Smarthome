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
            var response = await axios.get(constants.API_URI + '/smarthome/get_list');

            if (!response.data.success) {
                res.redirect(constants.API_URI + '/error');
            }

            res.render(viewPath + '/smart-homes/detail.ejs', { page: 'SMART HOME DETAIL', menuId: 'smart_homes', smartHomeList: response.data.data });
        } catch (error) {
            console.error(error);
        }
    }
}
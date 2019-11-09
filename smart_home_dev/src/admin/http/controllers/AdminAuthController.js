const axios = require('axios');
const constants = require('../../constants');

const viewPath = '../src/admin/views';

module.exports = {
    login: async function (req, res, next) {
        res.render(viewPath + '/login.ejs', { page: 'Login', menuId: 'home' });
    }
}
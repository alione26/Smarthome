const axios = require('axios');
const constants = require('../../constants');

const viewPath = '../src/admin/views';

module.exports = {
    admin: async function (req, res, next) {
        res.redirect('/admin/dashboard');
    },
    index: async function (req, res, next) {
        res.render(viewPath + '/dashboard.ejs', { page: 'Login', menuId: 'home' });
        //Todo: Check user is logged in? if yes redirect to admin panel, No redirect to login page
        //res.redirect('/admin/login');
    },
    login: async function (req, res, next) {
        res.render(viewPath + '/login.ejs', { page: 'Login', menuId: 'home' });
    },
    doLogin: async function (req, res, next) {
        res.redirect('/admin/dashboard');
    },
    users: async function (req, res, next) {
        res.render(viewPath + '/login.ejs', { page: 'Login', menuId: 'home' });
    },
}
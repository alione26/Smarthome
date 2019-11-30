
//const userController = require('../src/http/controllers/UserController');

var appRouter = function (app) {
    const userController = require('../src/http/controllers/UserController');
    //to handle HTTP get request
    const authControllerUser = require('../src/http/controllers/AuthController');
    //app.get('/user/get_list', authControllerUser.adminMiddleware , userController.user_list);
    app.get('/user/get_list', userController.user_list);
    app.get('/user/get_by_id/:id', userController.user_by_id);
    app.post('/user/add', userController.new_user);
    app.post('/user/update/:id', userController.update_user);
    app.delete('/user/delete/:id', userController.delete_user);

    const smarthomeController = require('../src/http/controllers/SmarthomeController');
    app.get('/smarthome/get_list', smarthomeController.smarthome_list);
    app.get('/smarthome/get_by_id/:id', authControllerUser.middleware, smarthomeController.smarthome_by_id);
    app.post('/smarthome/add', smarthomeController.new_smarthome);
    app.post('/smarthome/update/:id', smarthomeController.update_smarthome);
    app.delete('/smarthome/delete/:id', smarthomeController.delete_smarthome);
    app.get('/smarthome/:id', smarthomeController.getSmartHomeById);

    const smarthomeUserController = require('../src/http/controllers/SmarthomeUserController');
    app.get('/smarthome_user/get_list', smarthomeUserController.smarthomeUser_list);
    app.get('/smarthome_user/get_by_id/:id', smarthomeUserController.smarthomeUser_by_id);
    app.post('/smarthome_user/add', smarthomeUserController.new_smarthomeUser);
    app.post('/smarthome_user/update/:id', smarthomeUserController.update_smarthomeUser);
    app.post('/smarthome_user/update-fingerId/:id', smarthomeUserController.updateFingerId);
    app.delete('/smarthome_user/delete/:id', smarthomeUserController.delete_smarthomeUser);
    app.get('/smarthome_user/getBySmarthomeId/:id', smarthomeUserController.getSmartHomeUserBySmartHomeId);
    app.get('/smarthome_user/getByUserId/:id', smarthomeUserController.getSmartHomeUserByUserId);

    const smarthomeDeviceController = require('../src/http/controllers/SmarthomeDeviceController');
    app.get('/smarthome_device/get_list', smarthomeDeviceController.smarthomeDevice_list);
    app.get('/smarthome_device/get_by_id/:id', smarthomeDeviceController.smarthomeDevice_by_id);
    app.post('/smarthome_device/add', smarthomeDeviceController.new_smarthomeDevice);
    app.post('/smarthome_device/update/:id', smarthomeDeviceController.update_smarthomeDevice);
    app.post('/smarthome_device/update-data/:id', smarthomeDeviceController.updateSmartHomeDeviceData);
    app.delete('/smarthome_device/delete/:id', smarthomeDeviceController.delete_smarthomeDevice);
    app.get('/smarthome_device/:id', authControllerUser.middleware, smarthomeDeviceController.getSmartHomeDeviceBySmartHomeId);

    const userDeviceController = require('../src/http/controllers/UserDeviceController');
    app.get('/user_device/get_list', userDeviceController.userDevice_list);
    app.get('/user_device/get_by_id/:id', userDeviceController.userDevice_by_id);
    app.post('/user_device/add', userDeviceController.new_userDevice);
    app.post('/user_device/update/:id', userDeviceController.update_userDevice);
    app.delete('/user_device/delete/:id', userDeviceController.delete_userDevice);

    const adminController = require('../src/http/controllers/AdminController');
    app.post('/admin/new-admin', adminController.new_admin);
    app.get('/admin/get_by_id/:id', authControllerUser.adminMiddleware, adminController.admin_by_id);

    const adminDeviceController = require('../src/http/controllers/AdminDeviceController');
    app.get('/admin_device/get_by_token/:id', adminDeviceController.getAdminDeviceByToken);

    const authController = require('../src/http/controllers/AuthController');
    app.post('/auth/register', authController.register);
    app.post('/auth/login', authController.login);
    app.get('/auth/logout', authController.logout);
    app.post('/auth/admin/login', authController.adminLogin);
    app.get('/auth/admin/logout', authControllerUser.adminMiddleware, authController.adminLogout);

    const actionController = require('../src/http/controllers/ActionController');
    app.post('/action', actionController.action);

    // Web routes
    const indexController = require('../src/web/controllers/IndexController');

    /*app.get('/', function (req, res, next) {
        res.render('../src/web/views/index.ejs', {page:'Home', menuId:'home'});
    });*/

    app.get('/', indexController.index);
    app.get('/error', indexController.error);
    app.get('/smart-homes', indexController.smartHomes);
    app.get('/smart-homes/:id', indexController.detail);
    app.get('/smart-homes/devices/:id/users', indexController.smartHomeUsers);
    app.post('/smart-homes/do-action', indexController.doAction);
    app.post('/smart-homes/devices/finger-action', indexController.fingerAction);
    app.post('/smart-homes/web-hook', indexController.webHook);
    app.get('/smart-homes/devices/camera', indexController.cameraPage);
    app.post('/smart-homes/change-brightness', indexController.changeBrightness);

    // Login page added
    app.get('/loginPage', indexController.loginPage);
    app.get('/loginPage/signUp', indexController.signUpPage);
    app.post('/identify/login', indexController.authencation);
    app.post('/identify/signup', indexController.signUp);

    app.get('/showAuthButton', indexController.showAuthButton);
    // app.get('/checkSignedIn', authController.middleware);
    app.get('/userLogout', indexController.logOut);

    //Google Assistant
    const dialogFlowApp = require('../src/gga/DialogflowApp');
    app.post('/gga', dialogFlowApp);

    //Admin Auth
    const authAdminController = require('../src/admin/http/controllers/AdminAuthController');
    app.get('/admin/login', authAdminController.login);
    app.post('/admin/login', authAdminController.doLogin);
    app.get('/admin/dashboard', authAdminController.index);
    app.get('/admin', authAdminController.admin);
    app.get('/admin/logout', authAdminController.logout);
    app.get('/admin/user-management', authAdminController.userManagement);
    app.get('/admin/smarthome-mangament', authAdminController.smarthomeManagement);
}

module.exports = appRouter;

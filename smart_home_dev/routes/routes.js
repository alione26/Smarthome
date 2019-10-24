
//const userController = require('../src/http/controllers/UserController');

var appRouter = function (app) {
    const userController = require('../src/http/controllers/UserController');
    //to handle HTTP get request
    const authControllerUser = require('../src/http/controllers/AuthController');
    app.get('/user/get_list', authControllerUser.middleware , userController.user_list);
    app.get('/user/get_by_id/:id', userController.user_by_id);
    app.post('/user/add', userController.new_user);
    app.post('/user/update/:id', userController.update_user);
    app.delete('/user/delete/:id', userController.delete_user);

    const smarthomeController = require('../src/http/controllers/SmarthomeController');
    app.get('/smarthome/get_list', smarthomeController.smarthome_list);
    app.get('/smarthome/get_by_id/:id', smarthomeController.smarthome_by_id);
    app.post('/smarthome/add', smarthomeController.new_smarthome);
    app.post('/smarthome/update/:id', smarthomeController.update_smarthome);
    app.delete('/smarthome/delete/:id', smarthomeController.delete_smarthome);

    const smarthomeUserController = require('../src/http/controllers/SmarthomeUserController');
    app.get('/smarthome_user/get_list', smarthomeUserController.smarthomeUser_list);
    app.get('/smarthome_user/get_by_id/:id', smarthomeUserController.smarthomeUser_by_id);
    app.post('/smarthome_user/add', smarthomeUserController.new_smarthomeUser);
    app.post('/smarthome_user/update/:id', smarthomeUserController.update_smarthomeUser);
    app.post('/smarthome_user/update-fingerId/:id', smarthomeUserController.updateFingerId);
    app.delete('/smarthome_user/delete/:id', smarthomeUserController.delete_smarthomeUser);
    app.get('/smarthome_user/getBySmarthomeId/:id', smarthomeUserController.getSmartHomeUserBySmartHomeId);

    const smarthomeDeviceController = require('../src/http/controllers/SmarthomeDeviceController');
    app.get('/smarthome_device/get_list', smarthomeDeviceController.smarthomeDevice_list);
    app.get('/smarthome_device/get_by_id/:id', smarthomeDeviceController.smarthomeDevice_by_id);
    app.post('/smarthome_device/add', smarthomeDeviceController.new_smarthomeDevice);
    app.post('/smarthome_device/update/:id', smarthomeDeviceController.update_smarthomeDevice);
    app.post('/smarthome_device/update-data/:id', smarthomeDeviceController.updateSmartHomeDeviceData);
    app.delete('/smarthome_device/delete/:id', smarthomeDeviceController.delete_smarthomeDevice);
    app.get('/smarthome_device/:id', smarthomeDeviceController.getSmartHomeDeviceBySmartHomeId);

    const userDeviceController = require('../src/http/controllers/UserDeviceController');
    app.get('/user_device/get_list', userDeviceController.userDevice_list);
    app.get('/user_device/get_by_id/:id', userDeviceController.userDevice_by_id);
    app.post('/user_device/add', userDeviceController.new_userDevice);
    app.post('/user_device/update/:id', userDeviceController.update_userDevice);
    app.delete('/user_device/delete/:id', userDeviceController.delete_userDevice);

    const authController = require('../src/http/controllers/AuthController');
    app.post('/auth/register', authController.register);
    app.post('/auth/login', authController.login);
    app.post('/auth/logout', authController.logout);

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

    //Google Assistant
    const dialogFlowApp = require('../src/gga/DialogFlowApp');
    app.post('/gga', dialogFlowApp);
}

module.exports = appRouter;


//const userController = require('../src/http/controllers/UserController');

var appRouter = function (app) {
    const userController = require('../src/http/controllers/UserController');
    //to handle HTTP get request
    app.get('/user/get_list', userController.user_list);

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
    app.delete('/smarthome_user/delete/:id', smarthomeUserController.delete_smarthomeUser);
}

module.exports = appRouter;

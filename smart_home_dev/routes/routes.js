
//const userController = require('../src/http/controllers/UserController');

var appRouter = function (app) {
    const userController = require('../src/http/controllers/UserController');
    //to handle HTTP get request
    app.get('/user/get_list', userController.user_list);

    //app.get('/user/get_by_id/:id', userController.user_by_id);

    app.post('/user/add_new', userController.new_user);

    //app.post('/user/update/:id', userController.update_user);

    //app.delete('user/delete/:id', userController.delete_user);
}

module.exports = appRouter;

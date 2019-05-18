
//const userController = require('../src/http/controllers/UserController');

var appRouter = function (app) {
    const userController = require('../src/http/controllers/UserController');
    //to handle HTTP get request
    app.get('/', userController.getlist);

    app.get('/:id', userController.getid);

    app.post('/', userController.post);

    app.post('/:id', userController.put);

    app.delete('/', userController.delete);
}

module.exports = appRouter;

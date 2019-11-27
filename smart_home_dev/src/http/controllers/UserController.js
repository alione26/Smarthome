var userService = require("../services/UserService");
const uuidv4 = require('uuid/v4');
module.exports = {
    user_list : async function(req, res, next) {
        console.log("HTTP GET Request");
        var get_list_user = await userService.get_list();
        console.log(get_list_user.data);
        // var count = Object.keys(get_list_user.data).length;
        // console.log(count);
        if (get_list_user.status) {
             return res.status(200).json({ success : true, message : get_list_user.message, data : get_list_user.data});
         }
        return res.success(400).json({ success : false, message : get_list_user.message});
    },
    new_user : async function (req, res) {
        console.log("HTTP POST Request");
        var user_id = uuidv4();
        var userData = { user_id: user_id, name : req.body.name, password: req.body.password, email : req.body.email, phone : req.body.phone,
            gender : req.body.gender, date_of_birth : req.body.date_of_birth, created_at : req.body.created_at };
        var create_user = await userService.add_user(userData, user_id);
        console.log(create_user);
        if (create_user.status) {
            return res.status(200).json({ success: true, message: create_user.message });
        }
        return res.status(400).json({ success: false, message: create_user.message});
    },
    user_by_id : async function(req, res) {
        console.log("HTTP GET Request");
        var userId = req.params['id'];
        var get_by_id = await userService.user_by_id(userId);
        console.log(get_by_id);
        if (get_by_id.status) {
             return res.status(200).json({ success : true, message : get_by_id.message, data : get_by_id.data});
         }
        return res.success(400).json({ success : false, message : get_by_id.message});
    },
    update_user : async function(req, res) {
        console.log("HTTP PUT Request");
        var userId = req.params['id'];
        var userData = { user_id: user_id, name : req.body.name, password: req.body.password, email : req.body.email, phone : req.body.phone,
            gender : req.body.gender, date_of_birth : req.body.date_of_birth, created_at : req.body.created_at };
        var update_user = await userService.update_user(userId, userData);
        console.log(update_user);
        if (update_user.status) {
            return res.status(200).json({ success: true, message: update_user.message });
        }
        return res.status(400).json({ success: false, message: update_user.message});
    },
    delete_user : async function(req, res) {
        console.log("HTTP DELETE Request");
        var userId = req.params['id'];
        var delete_user = await userService.delete_user(userId);
        console.log(delete_user);
        if (delete_user.status) {
            return res.status(200).json({ success: true, message: delete_user.message });
        }
        return res.status(400).json({ success: false, message: delete_user.message});
    },
}

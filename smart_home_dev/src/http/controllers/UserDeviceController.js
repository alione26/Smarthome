var userDeviceService = require("../services/UserDeviceService");
const uuidv4 = require('uuid/v4');
module.exports = {
    userDevice_list : async function(req, res, next) {
        console.log("HTTP GET Request");
        var get_list_userDevice = await userDeviceService.get_list();
        console.log(get_list_userDevice);
        if (get_list_userDevice.status) {
             return res.status(200).json({ success : true, message : get_list_userDevice.message, data : get_list_userDevice.data});
         }
        return res.success(400).json({ success : false, message : get_list_userDevice.message});
    },
    new_userDevice : async function (userId, token, res) {
        console.log("HTTP POST Request");
        var userDevice_id = uuidv4();
        var userDeviceData = { userDevice_id : userDevice_id, user_id : userId, token : token, created_at : Math.floor(Date.now()/1000),
            latest : Math.floor(Date.now()/1000)};
        // var userDeviceData = { userDevice_id: userDevice_id, user_id : req.body.user_id, type : req.body.type,
        //     device_id : req.body.device_id, device_infor : req.body.device_infor, status : req.body.status,
        //     token : req.body.token, push_token : req.body.push_token, last_request : req.body.last_request};
        var create_userDevice = await userDeviceService.add_userDevice(userDeviceData, userDevice_id);
        console.log(create_userDevice);
        if (create_userDevice.status) {
            return res.status(200).json({ success: true, message: create_userDevice.message });
        }
        return res.status(400).json({ success: false, message: create_userDevice.message});
    },
    userDevice_by_id : async function(req, res) {
        console.log("HTTP GET Request");
        var userDeviceId = req.params['id'];
        var get_by_id = await userDeviceService.userDevice_by_id(userDeviceId);
        console.log(get_by_id);
        if (get_by_id.status) {
             return res.status(200).json({ success : true, message : get_by_id.message, data : get_by_id.data});
         }
        return res.success(400).json({ success : false, message : get_by_id.message});
    },
    update_userDevice : async function(req, res) {
        console.log("HTTP PUT Request");
        var userDeviceId = req.params['id'];
        var userDeviceData = { name : req.body.name, email : req.body.email, phone : req.body.phone };
        var update_userDevice = await userDeviceService.update_userDevice(userDeviceId, userDeviceData);
        console.log(update_userDevice);
        if (update_userDevice.status) {
            return res.status(200).json({ success: true, message: update_userDevice.message });
        }
        return res.status(400).json({ success: false, message: update_userDevice.message});
    },
    delete_userDevice : async function(req, res) {
        console.log("HTTP DELETE Request");
        var userDeviceId = req.params['id'];
        var delete_userDevice = await userDeviceService.delete_userDevice(userDeviceId);
        console.log(delete_userDevice);
        if (delete_userDevice.status) {
            return res.status(200).json({ success: true, message: delete_userDevice.message });
        }
        return res.status(400).json({ success: false, message: delete_userDevice.message});
    },
}

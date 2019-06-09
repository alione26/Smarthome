var smarthomeUserService = require("../services/SmarthomeUserService");
const uuidv4 = require('uuid/v4');
module.exports = {
    smarthomeUser_list : async function(req, res, next) {
        console.log("HTTP GET Request");
        var get_list_smarthomeUser = await smarthomeUserService.get_list();
        console.log(get_list_smarthomeUser);
        if (get_list_smarthomeUser.status) {
             return res.status(200).json({ success : true, message : get_list_smarthomeUser.message, data : get_list_smarthomeUser.data});
         }
        return res.success(400).json({ success : false, message : get_list_smarthomeUser.message});
    },
    new_smarthomeUser : async function (req, res) {
        console.log("HTTP POST Request");
        var smarthomeUser_id = uuidv4();
        var smarthomeUserData = { smarthomeUser_id: smarthomeUser_id, user_id : req.body.user_id, smarthome_id: req.body.smarthome_id,
            finger_id : req.body.finger_id, rfid_id : req.body.rfid_id, updated_at : req.body.updated_at, created_at : req.body.created_at };
        var create_smarthomeUser = await smarthomeUserService.add_smarthomeUser(smarthomeUserData, smarthomeUser_id);
        console.log(create_smarthomeUser);
        if (create_smarthomeUser.status) {
            return res.status(200).json({ success: true, message: create_smarthomeUser.message });
        }
        return res.status(400).json({ success: false, message: create_smarthomeUser.message});
    },
    smarthomeUser_by_id : async function(req, res) {
        console.log("HTTP GET Request");
        var smarthomeUserId = req.params['id'];
        var get_by_id = await smarthomeUserService.smarthomeUser_by_id(smarthomeUserId);
        console.log(get_by_id);
        if (get_by_id.status) {
             return res.status(200).json({ success : true, message : get_by_id.message, data : get_by_id.data});
         }
        return res.success(400).json({ success : false, message : get_by_id.message});
    },
    update_smarthomeUser : async function(req, res) {
        console.log("HTTP PUT Request");
        var smarthomeUserId = req.params['id'];
        var smarthomeUserData = { smarthomeUser_id: smarthomeUserId, user_id : req.body.user_id, smarthome_id: req.body.smarthome_id,
            finger_id : req.body.finger_id, rfid_id : req.body.rfid_id, updated_at : req.body.updated_at, created_at : req.body.created_at };
        var update_smarthomeUser = await smarthomeUserService.update_smarthomeUser(smarthomeUserId, smarthomeUserData);
        console.log(update_smarthomeUser);
        if (update_smarthomeUser.status) {
            return res.status(200).json({ success: true, message: update_smarthomeUser.message });
        }
        return res.status(400).json({ success: false, message: update_smarthomeUser.message});
    },
    delete_smarthomeUser : async function(req, res) {
        console.log("HTTP DELETE Request");
        var smarthomeUserId = req.params['id'];
        var delete_smarthomeUser = await smarthomeUserService.delete_smarthomeUser(smarthomeUserId);
        console.log(delete_smarthomeUser);
        if (delete_smarthomeUser.status) {
            return res.status(200).json({ success: true, message: delete_smarthomeUser.message });
        }
        return res.status(400).json({ success: false, message: delete_smarthomeUser.message});
    },
    getSmartHomeUserBySmartHomeId : async function(req, res) {
        var smarthomeId = req.params['id'];
        var getSmartHomeUser = await smarthomeUserService.getSmartHomeUserBySmartHomeId(smarthomeId);
        console.log(getSmartHomeUser);
        if (getSmartHomeUser.status) {
            return res.status(200).json({ success : true, message : getSmartHomeUser.message, data : getSmartHomeUser.data});
        }
        return res.status(400).json({success : false, message : getSmartHomeUser.message});
    }
}

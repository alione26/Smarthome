var smarthomeService = require("../services/SmarthomeService");
//var socketio = require("../../socketio/socketio"); //try socketio
const uuidv4 = require('uuid/v4');
module.exports = {
    smarthome_list : async function(req, res, next) {
        console.log("HTTP GET Request");
        var get_list_smarthome = await smarthomeService.get_list();
        console.log(get_list_smarthome);
        if (get_list_smarthome.status) {
             return res.status(200).json({ success : true, message : get_list_smarthome.message, data : get_list_smarthome.data});
         }
        return res.success(400).json({ success : false, message : get_list_smarthome.message});
    },
    new_smarthome : async function (req, res) {
        console.log("HTTP POST Request");
        var smarthome_id = uuidv4();
        var smarthomeData = { smarthome_id: smarthome_id, smarthome_user_id: req.body.smarthome_user_id,
            series_number : req.body.series_number, machine_type : req.body.machine_type,
            status : req.body.status, updated_at : req.body.updated_at, created_at : req.body.created_at,
            name : req.body.name };
        var create_smarthome = await smarthomeService.add_smarthome(smarthomeData, smarthome_id);
        console.log(create_smarthome);
        if (create_smarthome.status) {
            return res.status(200).json({ success: true, message: create_smarthome.message });
        }
        return res.status(400).json({ success: false, message: create_smarthome.message});
    },
    smarthome_by_id : async function(req, res) {
        console.log("HTTP GET Request");
        var smarthomeId = req.params['id'];
        var get_by_id = await smarthomeService.smarthome_by_id(smarthomeId);
        var socketId = get_by_id.data.socketId;
        //console.log(socketId); //try sockteio
        //await socketio.emitMessage(socketId, get_by_id.data); //trysocketio
        console.log(get_by_id);
        if (get_by_id.status) {
             return res.status(200).json({ success : true, message : get_by_id.message, data : get_by_id.data});
         }
        return res.success(400).json({ success : false, message : get_by_id.message});
    },
    update_smarthome : async function(req, res) {
        console.log("HTTP PUT Request");
        var smarthomeId = req.params['id'];
        smarthomeData = { smarthome_id: smarthome_id, smarthome_user_id: req.body.smarthome_user_id,
            series_number : req.body.series_number, machine_type : req.body.machine_type,
            status : req.body.status, updated_at : req.body.updated_at, created_at : req.body.created_at,
            name : req.body.name };
        var update_smarthome = await smarthomeService.update_smarthome(smarthomeId, smarthomeData);
        console.log(update_smarthome);
        if (update_smarthome.status) {
            return res.status(200).json({ success: true, message: update_smarthome.message });
        }
        return res.status(400).json({ success: false, message: update_smarthome.message});
    },
    delete_smarthome : async function(req, res) {
        console.log("HTTP DELETE Request");
        var smarthomeId = req.params['id'];
        var delete_smarthome = await smarthomeService.delete_smarthome(smarthomeId);
        console.log(delete_smarthome);
        if (delete_smarthome.status) {
            return res.status(200).json({ success: true, message: delete_smarthome.message });
        }
        return res.status(400).json({ success: false, message: delete_smarthome.message});
    },
    getSmartHomeById: async function(req, res) {
      console.log("HTTP GET Request");
      var smarthomeId = req.params['id'];
      var get_by_id = await smarthomeService.smarthome_by_id(smarthomeId);
      //var socketId = get_by_id.data.socketId;
      //console.log(socketId); //try sockteio
      //await socketio.emitMessage(socketId, get_by_id.data); //trysocketio
      console.log(get_by_id);
      if (get_by_id.status) {
           return res.status(200).json({ success : true, message : get_by_id.message, data : get_by_id.data});
       }
      return res.success(400).json({ success : false, message : get_by_id.message});
    }
}

var smarthomeDeviceService = require("../services/SmarthomeDeviceService");
const uuidv4 = require('uuid/v4');
module.exports = {
    smarthomeDevice_list : async function(req, res, next) {
        console.log("HTTP GET Request");
        var get_list_smarthomeDevice = await smarthomeDeviceService.get_list();
        console.log(get_list_smarthomeDevice);
        if (get_list_smarthomeDevice.status) {
             return res.status(200).json({ success : true, message : get_list_smarthomeDevice.message, data : get_list_smarthomeDevice.data});
         }
        return res.success(400).json({ success : false, message : get_list_smarthomeDevice.message});
    },
    new_smarthomeDevice : async function (req, res) {
        console.log("HTTP POST Request");
        var smarthomeDevice_id = uuidv4();
        var smarthomeDeviceData = { smarthomeDevice_id: smarthomeDevice_id, smarthome_id: req.body.smarthome_id,
            series_number : req.body.series_number, machine_type : req.body.machine_type,
            status : req.body.status, updated_at : req.body.updated_at, created_at : req.body.created_at,
            name : req.body.name, data : req.body.data };
        var create_smarthomeDevice = await smarthomeDeviceService.add_smarthomeDevice(smarthomeDeviceData, smarthomeDevice_id);
        console.log(create_smarthomeDevice);
        if (create_smarthomeDevice.status) {
            return res.status(200).json({ success: true, message: create_smarthomeDevice.message });
        }
        return res.status(400).json({ success: false, message: create_smarthomeDevice.message});
    },
    smarthomeDevice_by_id : async function(req, res) {
        console.log("HTTP GET Request");
        var smarthomeDeviceId = req.params['id'];
        var get_by_id = await smarthomeDeviceService.smarthomeDevice_by_id(smarthomeDeviceId);
        console.log(get_by_id);
        if (get_by_id.status) {
             return res.status(200).json({ success : true, message : get_by_id.message, data : get_by_id.data});
         }
        return res.success(400).json({ success : false, message : get_by_id.message});
    },
    update_smarthomeDevice : async function(req, res) {
        console.log("HTTP PUT Request");
        var smarthomeDeviceId = req.params['id'];
        var smarthomeDeviceData = { smarthomeDevice_id: smarthomeDeviceId, smarthome_id: req.body.smarthome_id,
            series_number : req.body.series_number, machine_type : req.body.machine_type,
            status : req.body.status, updated_at : req.body.updated_at, created_at : req.body.created_at,
            name : req.body.name, data : req.body.data };
        var update_smarthomeDevice = await smarthomeDeviceService.update_smarthomeDevice(smarthomeDeviceId, smarthomeDeviceData);
        console.log(update_smarthomeDevice);
        if (update_smarthomeDevice.status) {
            return res.status(200).json({ success: true, message: update_smarthomeDevice.message });
        }
        return res.status(400).json({ success: false, message: update_smarthomeDevice.message});
    },
    updateSmartHomeDeviceData : async function(req, res) {
        console.log("HTTP PUT Request");
        var smarthomeDeviceId = req.params['id'];
        var smarthomeDeviceData = { data : req.body.data };
        var update_smarthomeDevice = await smarthomeDeviceService.update_smarthomeDevice(smarthomeDeviceId, smarthomeDeviceData);
        console.log(update_smarthomeDevice);
        if (update_smarthomeDevice.status) {
            return res.status(200).json({ success: true, message: update_smarthomeDevice.message });
        }
        return res.status(400).json({ success: false, message: update_smarthomeDevice.message});
    },
    delete_smarthomeDevice : async function(req, res) {
        console.log("HTTP DELETE Request");
        var smarthomeDeviceId = req.params['id'];
        var delete_smarthomeDevice = await smarthomeDeviceService.delete_smarthomeDevice(smarthomeDeviceId);
        console.log(delete_smarthomeDevice);
        if (delete_smarthomeDevice.status) {
            return res.status(200).json({ success: true, message: delete_smarthomeDevice.message });
        }
        return res.status(400).json({ success: false, message: delete_smarthomeDevice.message});
    },
    getSmartHomeDeviceBySmartHomeId : async function(req, res) {
        console.log("HTTP GET Request");
        var smarthomeDeviceId = req.params['id'];
        var smarthomeDevices = await smarthomeDeviceService.getSmartHomeDeviceBySmartHomeId(smarthomeDeviceId);
        console.log(smarthomeDevices);
        if (smarthomeDevices.status) {
            return res.status(200).json({ success: true, message: smarthomeDevices.message, data : smarthomeDevices.data });
        }
        return res.status(400).json({ success: false, message: smarthomeDevices.message});
    },
}

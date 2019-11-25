var adminDeviceService = require("../services/AdminDeviceService");
const uuidv4 = require('uuid/v4');
module.exports = {
  new_adminDevice : async function (adminId, token) {
      console.log("HTTP POST Request");
      var adminDevice_id = uuidv4();
      var adminDeviceData = { adminDevice_id : adminDevice_id, admin_id : adminId, token : token, created_at : Math.floor(Date.now()/1000),
          latest : Math.floor(Date.now()/1000)};
      // var userDeviceData = { userDevice_id: userDevice_id, user_id : req.body.user_id, type : req.body.type,
      //     device_id : req.body.device_id, device_infor : req.body.device_infor, status : req.body.status,
      //     token : req.body.token, push_token : req.body.push_token, last_request : req.body.last_request};
      var create_adminDevice = await adminDeviceService.add_adminDevice(adminDeviceData, adminDevice_id);
      console.log(create_adminDevice);
      if (create_adminDevice.status) {
          return { success: true, message: create_adminDevice.message };
      }
      return { success: false, message: create_adminDevice.message };
  },
  getAdminDeviceByToken : async function(req, res) {
      console.log("HTTP GET Request");
      var adminDeviceToken = req.params['id'];
      var get_by_token = await adminDeviceService.getAdminDeviceByToken(adminDeviceToken);
      console.log(get_by_token.message);
      if (!get_by_token.status) {
            return res.status(400).json({ success : false, message : get_by_token.message});
       }
      return res.status(200).json({ success : true, message : get_by_token.message, data : get_by_token.data});
  },

}

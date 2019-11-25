var adminService = require("../services/AdminService");
const uuidv4 = require('uuid/v4');
module.exports = {
  new_admin : async function (req, res) {
      console.log("HTTP POST Request");
      var admin_id = uuidv4();
      var adminData = { admin_id: admin_id, name : req.body.name, password: req.body.password, email : req.body.email, phone : req.body.phone,
          gender : req.body.gender, date_of_birth : req.body.date_of_birth };
      var create_admin = await adminService.add_admin(adminData, admin_id);
      console.log(create_admin);
      if (create_admin.status) {
          return res.status(200).json({ success: true, message: create_admin.message });
      }
      return res.status(400).json({ success: false, message: create_admin.message});
  },
  admin_by_id : async function(req, res) {
      console.log("HTTP GET Request");
      var adminId = req.params['id'];
      var get_by_id = await adminService.admin_by_id(adminId);
      console.log(get_by_id.message);
      if (get_by_id.status) {
           return res.status(200).json({ success : true, message : get_by_id.message, data : get_by_id.data});
       }
      return res.success(400).json({ success : false, message : get_by_id.message});
  },
}

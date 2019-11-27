const axios = require('axios');
const constants = require('../../constants');

const viewPath = '../src/admin/views';

module.exports = {
    admin: async function (req, res, next) {
        res.redirect('/admin/dashboard');
    },
    index: async function (req, res, next) {
      try {

          var adminSs = req.session;
          //console.log(req.session);
          //console.log(Object.keys(ss).length);

          if (adminSs == undefined || !(Object.keys(adminSs).length - 1)) {
              return res.redirect(constants.API_URI + '/admin/login');
          }

          var getAdminDevice = await axios.get(constants.API_URI + '/admin_device/get_by_token/' + adminSs.adminUuid,
          { headers: { 'uuid': adminSs.adminUuid } });
          //console.log('hehehe:', getAdminDevice.data.status);
          //console.log(getAdminDevice);
          if (!getAdminDevice.data.success) {
              //console.log('check');
              res.redirect(constants.API_URI + '/error');
          }
          var adminDeviceData = getAdminDevice.data.data;
          var adminDeviceContent = adminDeviceData[Object.keys(adminDeviceData)[0]];

          var getAdmin = await axios.get(constants.API_URI + '/admin/get_by_id/' + adminDeviceContent.admin_id,
          { headers: { 'uuid': adminSs.adminUuid } });
          if (!getAdmin.data.success) {
              res.redirect(constants.API_URI + '/error');
          }
          var adminData = getAdmin.data.data;
          req.session.adminName = adminData.name;
          //console.log(adminData.email, 'is adminEmail');
          // var adminContent = adminData[Object.keys(adminData)[0]];
          // console.log('adminData:', adminContent.email);

          //res.render(viewPath + '/smart-homes/index.ejs', { page: 'SMART HOMES', menuId: 'smart_homes', smartHomeList: response.data.data });
          res.render(viewPath + '/dashboard.ejs', { page: 'Dashboard', menuId: 'home', adminName : adminData.name });
      } catch (error) {
          //console.log(error);
          res.redirect(constants.API_URI + '/admin/login');
      }
  },

        //Todo: Check user is logged in? if yes redirect to admin panel, No redirect to login page
        //res.redirect('/admin/login');
    login: async function (req, res, next) {
        res.render(viewPath + '/login.ejs', { page: 'Login', menuId: 'home' });
    },
    doLogin: async function (req, res, next) {
        // console.log('email' + req.body.email);
        // console.log('password' + req.body.password);
        var email = req.body.email;
        var password = req.body.password;

        var response = await axios.post(constants.API_URI + '/auth/admin/login', {
            email: email,
            password: password
        })
            .then(function (response) {
                if (!response.data.success) {
                    res.status(400).json({ success: false, message: response.data.message });
                }

                req.session.adminUuid = response.headers.uuid;
                req.session.adminSigned = true;
                //console.log(req.session);
                //res.redirect('/admin/dashboard');
                //req.session.save();
                console.log('admin-signed :', req.session.adminSigned);
                res.status(200).set('uuid', response.headers.uuid).json({ success: true, message: response.data.message });
            })
            .catch(function (error) {
                //console.log(error);
                res.status(400).json({ success: false, message: error.message });
            });

    },
    users: async function (req, res, next) {
        res.render(viewPath + '/login.ejs', { page: 'Login', menuId: 'home' });
    },
    logout: async function (req, res, next) {
        console.log(req.session.adminUuid);
        try {
            var response = await axios.get(constants.API_URI + '/auth/admin/logout', { 'headers': { 'uuid': req.session.adminUuid } });
            if (!response.data.success) {
                return res.status(400).json({ success: response.data.success });
            }
            req.session.adminSigned = !response.data.success;
            console.log('check-admin-logout :', response.data.success, '& admin-signed:', req.session.adminSigned);
            //return res.status(200).json({ success: response.data.success });
            return res.redirect('/admin/login');
        } catch (error) {
            console.log(error);
        }
    },
    userManagement: async function (req, res, next) {
      try {
        //console.log(req.session.adminUuid);
        //var getUserList = await axios.get(constants.API_URI + '/user/get_list', { 'headers': { 'uuid': req.senssion.adminUuid } });
        var getUserList = await axios.get(constants.API_URI + '/user/get_list');
        if(!getUserList.data.success) {
          return res.status(400).json({ success: getUserList.data.success });
        }
        var userListData = getUserList.data.data;
        var userListLength = Object.keys(userListData).length;
        //console.log(userListData);
        //console.log( 'userListLength:', userListLength);
        var userCount;
        for ( userCount = 0; userCount < userListLength; userCount++) {
          //console.log('userCount:', userCount);
          var userInfor = userListData[Object.keys(userListData)[userCount]];
          var userId = userInfor.user_id;
          //var userCheck;
          var getSmartHomeUser = await axios.get(constants.API_URI + '/smarthome_user/getByUserId/' + userId)
            .then(async function(response) {
              var smartHomeUserData = response.data.data;
              //console.log('smartHomeUserData:', smartHomeUserData);
              var smartHomeUserInfor = smartHomeUserData[Object.keys(smartHomeUserData)[0]];
              var smartHomeId = smartHomeUserInfor.smarthome_id;
              userInfor.smarthome_id = smartHomeId;
              var getSmartHome = await axios.get(constants.API_URI + '/smarthome/' + smartHomeId)
                .then(function(response){
                  //console.log('smarthome-check:', response.data.data);
                  var smartHomeData = response.data.data;
                  //var smartHomeInfor = smartHomeData[Object.keys(smartHomeData)[0]];
                  var smartHomeName = smartHomeData.name;
                  //console.log('name:', smartHomeName);
                  userInfor.smarthome_name = smartHomeName;
                  //console.log('check:', userInfor);
                })
                .catch(function(error){
                  console.log(error);
                });
              //console.log('smartHomeUserInfor:', smartHomeUserInfor);
              //userCheck = 1;
            })
            .catch(function(error){
              userInfor.smarthome_id = '';
              userInfor.smarthome_name = '';
              //console.log('test response:', error.response.data);
              //userCheck = 0;
            });
            //console.log('userCheck:', userCheck);
          // if(!getSmartHomeUser.data.success) {
          //   return res.status(400).json({ success: getSmartHomeUser.data.success });
          // }
          // var smartHomeUser = getSmartHomeUser.data.data;
          // console.log('smartHomeUser:', smartHomeUser);
          //console.log('user', userCount, ':', userInfor);
        }
        console.log("USER-DATA-2-SENT", userListData);
        res.render(viewPath + '/user/user.ejs', { page: 'User Managment', menuId: 'home', userListData: userListData, adminName : req.session.adminName });

        //console.log('test:', getUserList.data);
        // var getSmartHomeList = await ;
        // var getSmartHomeUser = await;

      } catch (error) {
        console.log('user-management Error:', error);
      }
    }
}

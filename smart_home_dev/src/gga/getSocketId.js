var firebase = require('firebase');

module.exports = {
  getSmartHomeBySmartHomeId : async function(smarthomeId) {
    var smartHomeReference = firebase.database().ref("/smarthomes");
    try {
          return await smartHomeReference.orderByChild("smarthome_id")
            .equalTo(smarthomeId)
            .once('value').then(
                function(snapshot){
                    if (snapshot.val()) {
                        return { status : true, message :"The read smarthomes succeeded", data : snapshot.val()};
                    }
                    return { status : false, message : "The read smarthomes failed", data: null };
                    smartHomeReference.off("value");
                },
                function(errorObject){
                    console.log("The read failed: " + errorObject.code);
                    return { status : false, message : "The read failed: " + errorObject.code, data: null };
                }
          );
    }catch (e) {
        throw Error(e.message);
    }
},
  getSocketId : async function(smarthomeId) {
    var getSmartHome = await module.exports.getSmartHomeBySmartHomeId(smarthomeId);
    if (!getSmartHome.status && !getSmartHome.data) {
      //return res.status(400).json({ success: false, message: getSmartHome.message });
      console.log('fail get data');
    }
    var smartHomeData = getSmartHome.data;
    var smartHomeContent = smartHomeData[Object.keys(smartHomeData)[0]];
    var socketId = smartHomeContent.socketId;
    return socketId;
  }
}

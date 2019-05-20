var user = require("./../models/Users");

module.exports = {
    /*get_list : function(req, res, next) {
        var userReference = firebase.database().ref("/users/");

        //Attach an asynchronous callback to read the data
        userReference.on("value",
                  function(snapshot) {
                        console.log(snapshot.val());
                        res.json(snapshot.val());
                        //return res.status(200).json({ success: true, data: null, message: "Succesfully" });
                        userReference.off("value");
                        },
                  function (errorObject) {
                        console.log("The read failed: " + errorObject.code);
                        res.send("The read failed: " + errorObject.code);
                 });
    },*/
    add_user : async function(userData, user_id) {
        return await user.add_user(userData, user_id);
    },
}

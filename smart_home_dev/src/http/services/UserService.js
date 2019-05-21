var user = require("./../models/Users");

module.exports = {

    add_user : async function(userData, user_id) {
        return await user.add_user(userData, user_id);
    },
    get_list : async function() {
        return await user.get_list();
    },
    user_by_id : async function(userId) {
        return await user.user_by_id(userId);
    },
    update_user : async function(userId,userData) {
        return await user.update_user(userId,userData);
    },
    delete_user : async function(userId) {
        return await user.delete_user(userId);
    },
}

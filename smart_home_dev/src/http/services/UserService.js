var Users = require("./../models/Users");

module.exports = {

    add_user : async function(userData, user_id) {
        return await Users.add_user(userData, user_id);
    },
    get_list : async function() {
        return await Users.get_list();
    },
    user_by_id : async function(userId) {
        return await Users.user_by_id(userId);
    },
    update_user : async function(userId,userData) {
        return await Users.update_user(userId,userData);
    },
    delete_user : async function(userId) {
        return await Users.delete_user(userId);
    },
    register : async function(userData) {
        try {
            var getUser = await Users.getUserByEmail(userData.email);

            if (getUser.status && getUser.data) {
                return { status: false, message: 'This email is already taken.', data: null };
            }

            var isSuccess = await Users.register(userData);
            if (!isSuccess.status) {
                return { status: false, message: 'Can not regiser user.', data: isSuccess.message };
            }

            return { status: true, message: 'Successfully.', data: isSuccess.data };
        } catch (e) {
            throw Error(e.message);
        }
    },
}

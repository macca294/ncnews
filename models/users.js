const connection = require("../db/connection");

exports.selectUserByUsername = (username) => {

    return connection("users")
        .where("users.username", "=", username)
        .returning("*")


}
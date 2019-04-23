const connection = require("../connection");

exports.selectAllTopics = () => {
    return connection("topics")
        .returning('*')

}
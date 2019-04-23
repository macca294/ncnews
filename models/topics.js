const connection = require("../db/connection");

exports.selectAllTopics = () => {
    return connection("topics")
        .returning('*')
        .then((
            topicRows

        ) => {
            return {
                'topics': topicRows
            }
        })
}
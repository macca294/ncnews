const connection = require("../db/connection");

exports.updateCommentsByCommentId = (update, id) => {
    const increment = Object.values(update)[0]

    return connection("comments")
        .where("comments.comment_id", "=", id)
        .increment('votes', increment)
        .returning("*")
        .then(comment => comment[0])

}

exports.deleteCommentsByCommentId = (id) => {
    return connection("comments")
        .where("comments.comment_id", "=", id)
        .del()
        .returning("*")
        .then(body => body[0])

}
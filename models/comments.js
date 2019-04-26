const connection = require("../db/connection");

exports.updateCommentsByCommentId = (update, id) => {
    const increment = Object.values(update)[0]

    return connection("comments")
        .where("comments.comment_id", "=", id)
        .increment('votes', increment)
        .returning("*")
        .then(comment => comment)

}

exports.deleteCommentsByCommentId = (id) => {
    return connection("comments")
        .where("comments.comment_id", "=", id)
        .del()
        .returning("*")
        .then(body => body)

}
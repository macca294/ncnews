const connection = require("../db/connection");

exports.updateCommentsByCommentId = (update, id) => {
    const increment = update.inc_votes

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

exports.selectCommentByCommentId = (id) => {
    return connection("comments")
        .where("comments.comment_id", "=", id)
        .returning("*")
        .then(body => body)
}
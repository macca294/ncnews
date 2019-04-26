const {
    updateCommentsByCommentId,
    deleteCommentsByCommentId
} = require('../models/comments')


exports.patchCommentsByCommentId = (req, res, next) => {
    const {
        comment_id
    } = req.params

    updateCommentsByCommentId(req.body, comment_id)
        .then(comment => {
            res.status(200)
                .send(comment)
        }).catch(next)

}

exports.removeCommentsByCommentId = (req, res, next) => {
    const {
        comment_id
    } = req.params

    deleteCommentsByCommentId(comment_id)
        .then(emptyBody => {
            res.status(204)
                .send(emptyBody)
        }).catch(next)

}
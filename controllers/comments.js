const {
    updateCommentsByCommentId,
    deleteCommentsByCommentId,
    selectCommentByCommentId
} = require('../models/comments')


exports.patchCommentsByCommentId = (req, res, next) => {
    const {
        comment_id
    } = req.params

    if (Object.keys(req.body).length === 0) {
        req.body = {
            'inc_votes': 0
        }
    }

    updateCommentsByCommentId(req.body, comment_id)
        .then(([comment]) => {
            if (!comment) next({
                code: 404
            })
            else res.status(200)
                .send({
                    comment: comment
                })
        }).catch(next)

}

exports.removeCommentsByCommentId = (req, res, next) => {
    const {
        comment_id
    } = req.params

    selectCommentByCommentId(comment_id)
        .then((body) => {
            if (body.length === 0) next({
                code: 404
            })
            else deleteCommentsByCommentId(comment_id)
                .then(([emptyBody]) => {
                    res.status(204)
                        .send({
                            comment: emptyBody
                        })
                }).catch(next)
        }).catch(next)




}
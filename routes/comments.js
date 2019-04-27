const commentsRouter = require("express").Router();
const {
    patchCommentsByCommentId,
    removeCommentsByCommentId,

} = require("../controllers/comments");
const {
    methodNotAllowed
} = require('../errors/index')

commentsRouter.route("/:comment_id")
    .patch(patchCommentsByCommentId)
    .delete(removeCommentsByCommentId)
    .all(methodNotAllowed)

module.exports = commentsRouter;
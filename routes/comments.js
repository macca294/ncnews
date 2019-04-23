const commentsRouter = require("express").Router();
const {
    patchCommentsByCommentId,
    deleteCommentsByCommentId
} = require("../controllers/comments");

commentsRouter.route("/:comment_id")
    .patch(patchCommentsByCommentId)
    .delete(deleteCommentsByCommentId)

module.exports = commentsRouter;
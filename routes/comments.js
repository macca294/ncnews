const commentsRouter = require("express").Router();
const {
    patchCommentsByCommentId,
    removeCommentsByCommentId
} = require("../controllers/comments");

commentsRouter.route("/:comment_id")
    .patch(patchCommentsByCommentId)
    .delete(removeCommentsByCommentId)

module.exports = commentsRouter;
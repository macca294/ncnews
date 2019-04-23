const commentsRouter = require("express").Router();
const {
    patchCommentsByCommentId,
    deleteCommentsByCommentId
} = require("../controllers/comments");

topicsRouter.route("/:comment_id")
    .patch(patchCommentsByCommentId)
    .delete(deleteCommentsByCommentId)

module.exports = commentsRouter;
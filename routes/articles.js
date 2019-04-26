const articlesRouter = require("express").Router();
const {
    getAllArticles,
    getArticlesById,
    getCommentsByArticleId,
    postCommentByArticleId,
    patchArticlesById
} = require("../controllers/articles");

articlesRouter.route("/")
    .get(getAllArticles)
    .all(methodNotAllowed)

articlesRouter.route("/:id")
    .get(getArticlesById)
    .patch(patchArticlesById)
    .all(methodNotAllowed)

articlesRouter.route("/:id/comments")
    .get(getCommentsByArticleId)
    .post(postCommentByArticleId)
    .all(methodNotAllowed)

module.exports = articlesRouter;
const articlesRouter = require("express").Router();
const {
    getAllArticles,
    getArticlesById,
    getCommentsByArticleId,
    postCommentByArticleId,
    patchArticlesById
} = require("../controllers/articles");

articlesRouter.route("/")
    .get(getAllArticles);

articlesRouter.route("/:id")
    .get(getArticlesById)
    .patch(patchArticlesById)

// articlesRouter.route("/:id/comments")
//     .get(getCommentsByArticleId)
//     .post(postCommentByArticleId)

module.exports = articlesRouter;
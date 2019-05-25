const articlesRouter = require("express").Router();
const {
    getAllArticles,
    getArticlesById,
    postArticle,
    getCommentsByArticleId,
    postCommentByArticleId,
    patchArticlesById,
    
} = require("../controllers/articles");

const {methodNotAllowed} = require('../errors/index') 

articlesRouter.route("/")
    .get(getAllArticles)
    .post(postArticle)
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
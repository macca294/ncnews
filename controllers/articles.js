const {
    selectAllArticles,
    selectArticlesById,
    updateArticlesById,
    selectCommentsByArticleId,
    insertCommentByArticleId
} = require('../models/articles')


exports.getAllArticles = (req, res, next) => {
    selectAllArticles(req.query)
        .then((
            articles
        ) => {
            if (articles.length === 0) next({
                code: 404,
                msg: "Article not found"
            });
            else res.status(200)
                .send({
                    'articles': articles
                })
        })
        .catch(next);


}

exports.getArticlesById = (req, res, next) => {
    const {
        id
    } = req.params;

    selectArticlesById(id)
        .then((articles) => {
            if (articles.length === 0)
                return Promise.reject({
                    code: 404,
                    msg: 'article_id does not exist'
                });
            res.status(200).send({
                'articles': articles
            })
        }).catch(next);

}

exports.patchArticlesById = (req, res, next) => {
    const {
        id
    } = req.params;

    updateArticlesById(req.body, id)
        .then((article) => {
            res.status(200).send({

                'Article updated': article
            })
        }).catch(next);
}

exports.getCommentsByArticleId = (req, res, next) => {
    const {
        id
    } = req.params;

    selectCommentsByArticleId(id, req.query)
        .then((comments) => {
            res.status(200).send({
                'Comments': comments
            })
        }).catch(next);


}

exports.postCommentByArticleId = (req, res, next) => {
    const {
        id
    } = req.params

    insertCommentByArticleId(req.body, id)
        .then((comment) => {
            res.status(201).send({
                'comment': comment
            })
        }).catch(next)

}
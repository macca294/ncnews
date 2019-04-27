const {
    selectAllArticles,
    selectArticlesById,
    updateArticlesById,
    selectCommentsByArticleId,
    insertCommentByArticleId
} = require('../models/articles')


exports.getAllArticles = (req, res, next) => {
    if (req.query.order && req.query.order !== 'asc') req.query.order = 'desc'
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
        .then(([article]) => {
            if (article === undefined)
                return Promise.reject({
                    code: 404,
                    msg: 'article_id does not exist'
                });
            res.status(200).send({
                'article': article
            })
        }).catch(next);

}

exports.patchArticlesById = (req, res, next) => {
    const {
        id
    } = req.params;

    updateArticlesById(req.body, id)
        .then(([article]) => {
            res.status(200).send({

                'article': article
            })
        }).catch(next);
}

exports.getCommentsByArticleId = (req, res, next) => {
    const {
        id
    } = req.params;
    if (req.query.order && req.query.order !== 'asc') req.query.order = 'desc'

    selectCommentsByArticleId(id, req.query)
        .then(([...comments]) => {
            res.status(200).send({
                'comments': [...comments]
            })
        }).catch(next);


}

exports.postCommentByArticleId = (req, res, next) => {
    const {
        id
    } = req.params

    insertCommentByArticleId(req.body, id)
        .then(([comment]) => {
            res.status(201).send({
                'comment': comment
            })
        }).catch(next)

}
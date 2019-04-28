const {
    selectAllArticles,
    selectArticlesById,
    updateArticlesById,
    selectCommentsByArticleId,
    insertCommentByArticleId,

} = require('../models/articles')
const {
    selectUserByUsername
} = require('../models/users')

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

    if (Object.keys(req.body).length === 0) req.body = {
        inc_votes: 0
    }
    if (typeof req.body.inc_votes !== 'number') next({
        code: 400
    })



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

    selectArticlesById(id)
        .then(([article]) => {
            if (article === undefined)
                return Promise.reject({
                    code: 404,
                    msg: 'article_id does not exist'
                });
            selectCommentsByArticleId(id, req.query)
                .then(([...comments]) => {
                    res.status(200).send({
                        'comments': [...comments]
                    })
                }).catch(next)
        }).catch(next)


}

exports.postCommentByArticleId = (req, res, next) => {
    const {
        id
    } = req.params

    if (!req.body.username || !req.body.body) next({
        code: 400
    })

    insertCommentByArticleId(req.body, id)
        .then(([comment]) => {
            res.status(201).send({
                'comment': comment
            })
        }).catch(next)

}
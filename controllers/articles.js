const {
    selectAllArticles,
    selectArticlesById
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

    selectArticlesById(req.params)
        .then((articles) => {
            res.status(200).send({
                'articles': articles
            })
        }).catch(next);

}
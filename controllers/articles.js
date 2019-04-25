const {
    selectAllArticles,
    selectArticlesById,
    updateArticlesById
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
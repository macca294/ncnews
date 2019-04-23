const {
    selectAllArticles
} = require('../models/articles')


exports.getAllArticles = (req, res, next) => {
    selectAllArticles()
        .then((articles) => {
            res.status(200)
                .send(articles)
        })
        .catch(next);


}
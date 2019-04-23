const connection = require("../db/connection");

exports.selectAllArticles = () => {
    return connection("articles")
        .returning('*')
        .then((
            articleRows
        ) => {
            return {
                'articles': articleRows
            }
        })
}
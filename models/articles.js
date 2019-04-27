const connection = require("../db/connection");

exports.selectAllArticles = ({
    author = '%',
    topic = '%',
    sort_by = "articles.created_at",
    order = "desc"
}) => {
    return connection("articles").select(
            'articles.article_id', 'articles.title', 'articles.body', 'articles.votes', 'articles.topic', 'articles.author', 'articles.created_at')
        .leftJoin("comments", "comments.article_id", "=", "articles.article_id")
        .count('comment_id as comment_count')
        .where("articles.author", "like", author)
        .andWhere("articles.topic", "like", topic)
        .groupBy('articles.article_id')
        .orderBy(sort_by, order)
}

exports.selectArticlesById = article_id => {
    return connection("articles").select(
            'articles.article_id', 'articles.title', 'articles.body', 'articles.votes', 'articles.topic', 'articles.author', 'articles.created_at')
        .leftJoin("comments", "comments.article_id", "=", "articles.article_id")
        .count('comment_id as comment_count')
        .where("articles.article_id", "=", article_id)
        .groupBy('articles.article_id')


}

exports.updateArticlesById = (update, id) => {
    const increment = Object.values(update)[0]

    return connection("articles")
        .where("articles.article_id", "=", id)
        .increment('votes', increment)
        .returning("*")
        .then(article => article)
}

exports.selectCommentsByArticleId = (id, {
    sort_by = 'comments.created_at',
    order = 'desc'
}) => {

    return connection("comments")
        .where("comments.article_id", "=", id)
        .returning('*')
        .orderBy(sort_by, order)
        


}

exports.insertCommentByArticleId = (post, id) => {

    const formattedPost = {};
    formattedPost.author = post.username,
        formattedPost.body = post.body,
        formattedPost.article_id = id

    return connection("comments")
        .where("comments.article_id", id)
        .insert(formattedPost)
        .returning('*')
        .then(comment => comment)


}
const {
  topicsData,
  articlesData,
  usersData,
  commentsData
} = require('../data');
const {
  createRef,
  renameKey,
  formatDate,
  formatData
} = require('../../utils/utils')


exports.seed = (knex, Promise) => {
  return knex.migrate
    .rollback()
    .then(() => knex.migrate.latest())
    .then(() => {
      return knex('topics')
        .insert(topicsData)
        .returning('*')
    }).then((topic) => {
      return knex('users')
        .insert(usersData)
        .returning('*')
    }).then(() => {
      const formattedArticles = formatDate(articlesData)
      return knex('articles')
        .insert(formattedArticles)
        .returning('*')
    }).then((articles) => {

      const formattedCommentsDates = formatDate(commentsData)
      const formattedCommentsAuthor = renameKey(formattedCommentsDates, 'created_by', 'author')
      const refObj = createRef(articles, 'title', 'article_id')
      const formattedComments = formatData(formattedCommentsAuthor, refObj)

      return knex('comments')
        .insert(formattedComments)
        .returning('*')
    })


};
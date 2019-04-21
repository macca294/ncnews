const {
  topicsData,
  articlesData,
  usersData,
  commentsData
} = require('../data');
const {
  timeConverter,
  createRef,
  formatDate
} = require('../../utils/utils')


exports.seed = (knex, Promise) => {
  return knex.migrate
    .rollback()
    .then(() => knex.migrate.latest())
    .then(() => {
      return knex('topics')
        .insert(topicsData)
        .returning('*')
    }).then(() => {
      return knex('users')
        .insert(usersData)
        .returning('*')
    }).then(() => {
      const formattedArticles = formatDate(articlesData)
      console.log(formattedArticles)
      return knex('articles')
        .insert(formattedArticles)
        .returning('*')
    })


};
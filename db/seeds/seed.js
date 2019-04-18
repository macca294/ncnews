const {
  topicsData,
  articlesData,
  usersData,
  commentsData
} = require('../data');


console.log(topicsData)
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
    }).then(() => {})

};
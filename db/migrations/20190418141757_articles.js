exports.up = function (knex, Promise) {
    // console.log('creating articles table...');
    return knex.schema.createTable('articles', articlesTable => {
        articlesTable.increments('article_id').primary();
        articlesTable.string('title').notNullable();
        articlesTable.text('body').notNullable();
        articlesTable.integer('votes').defaultTo(0)
        articlesTable.string('topic')
        articlesTable.foreign('topic').references('topics.slug')
        articlesTable.string('author')
        articlesTable.foreign('author').references('users.username')
        articlesTable.datetime('created_at', {
            precision: 6
        }).defaultTo(knex.fn.now(6))
    });
};

exports.down = function (knex, Promise) {
    // console.log('removing articles tables...');
    return knex.schema.dropTable('articles');
};
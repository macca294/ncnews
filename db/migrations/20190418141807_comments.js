exports.up = function (knex, Promise) {
    // console.log('creating comments table...');
    return knex.schema.createTable('comments', commentsTable => {
        commentsTable.increments('comment_id').primary();
        commentsTable.string('author').notNullable()
        commentsTable.foreign('author').references('users.username')
        commentsTable.integer('article_id')
        commentsTable.foreign('article_id').references('articles.article_id')
        commentsTable.integer('votes').defaultTo(0)
        commentsTable.datetime('created_at', {
            precision: 6
        }).defaultTo(knex.fn.now(6))
        commentsTable.text('body').notNullable()

    });
};

exports.down = function (knex, Promise) {
    // console.log('removing comments tables...');
    return knex.schema.dropTable('comments');
};
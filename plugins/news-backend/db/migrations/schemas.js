/**
 * @param {import('knex').Knex} knex
 */
exports.up = async function up(knex) {
  await knex.schema.createTable('news', table => {
    table.comment('The table for news.');
    table.text('id').notNullable().primary().comment('News ID');
    table.text('title').notNullable().comment('Title of the news article.');
    table
      .text('summary')
      .notNullable()
      .comment('Short summary of the news article.');
    table
      .string('author')
      .notNullable()
      .comment('A catalog reference to the team publishing the news.');
    table
      .text('status')
      .notNullable()
      .comment('Whether the news article is in draft or published.');
    table.text('body').notNullable();
    table.timestamp('created_at').notNullable().index('news_created_at_idx');
    table.specificType('tags', 'text ARRAY').notNullable();
  });
};

/**
 * @param {import('knex').Knex} knex
 */
exports.down = async function down(knex) {
  await knex.schema.alterTable('news', table => {
    table.dropIndex([], 'news_created_at_idx');
  });

  await knex.schema.dropTable('news');
};

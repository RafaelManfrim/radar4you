import type { Knex } from 'knex'

export async function up(knex: Knex): Promise<void> {
  await knex.schema.createTable('user_cards', (table) => {
    table.uuid('id').primary()
    table
      .uuid('user_id')
      .notNullable()
      .references('id')
      .inTable('users')
      .onDelete('CASCADE')
    table
      .uuid('card_id')
      .notNullable()
      .references('id')
      .inTable('cards')
      .onDelete('CASCADE')
    table.timestamps(true, true) // Adiciona created_at e updated_at automaticamente
  })
}

export async function down(knex: Knex): Promise<void> {
  await knex.schema.dropTable('user_cards')
}

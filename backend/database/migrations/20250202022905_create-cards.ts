import type { Knex } from 'knex'

export async function up(knex: Knex): Promise<void> {
  await knex.schema.createTable('cards', (table) => {
    table.uuid('id').primary()
    table.string('title').notNullable()
    table
      .uuid('financial_institution_id')
      .notNullable()
      .references('id')
      .inTable('financial_institutions')
      .onDelete('CASCADE')
    table
      .uuid('card_brand_id')
      .notNullable()
      .references('id')
      .inTable('card_brands')
      .onDelete('CASCADE')
    table.enum('points_currency', ['USD', 'BRL']).notNullable()
    table.decimal('points_conversion_rate', 10, 2).notNullable()
    table.timestamps(true, true) // Adiciona created_at e updated_at automaticamente
  })
}

export async function down(knex: Knex): Promise<void> {
  await knex.schema.dropTable('cards')
}

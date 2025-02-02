import type { Knex } from 'knex'

export async function up(knex: Knex): Promise<void> {
  await knex.schema.createTable('financial_institutions', (table) => {
    table.uuid('id').primary()
    table.string('name').notNullable()
    table.string('logo_url').nullable()
    table.timestamps(true, true) // Adiciona created_at e updated_at automaticamente
  })
}

export async function down(knex: Knex): Promise<void> {
  await knex.schema.dropTable('financial_institutions')
}

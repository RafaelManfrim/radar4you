import type { Knex } from 'knex'

export async function up(knex: Knex): Promise<void> {
  await knex.schema.createTable('user_refresh_tokens', (table) => {
    table.uuid('id').primary()
    table.uuid('user_id').notNullable().references('id').inTable('users')
    table.string('token', 1024).notNullable().unique()
    table.datetime('expires_at').notNullable()
    table.timestamps(true, true) // Adiciona created_at e updated_at automaticamente
  })
}

export async function down(knex: Knex): Promise<void> {
  await knex.schema.dropTable('user_refresh_tokens')
}

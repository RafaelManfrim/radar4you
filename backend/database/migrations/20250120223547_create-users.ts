import type { Knex } from 'knex'

export async function up(knex: Knex): Promise<void> {
  await knex.schema.createTable('users', (table) => {
    table.uuid('id').primary()
    table
      .enum('login_provider', ['email', 'google', 'facebook'])
      .defaultTo('email')
    table.string('firebase_uid')
    table.string('first_name', 255).notNullable()
    table.string('email', 255).notNullable().unique()
    table.string('password_hash', 255)
    table.datetime('accepted_terms_at').notNullable()
    table
      .boolean('is_email_notifications_enabled')
      .notNullable()
      .defaultTo(false)
    table.timestamps(true, true) // Adiciona created_at e updated_at automaticamente
    table.string('profile_picture_url')
  })
}

export async function down(knex: Knex): Promise<void> {
  await knex.schema.dropTable('users')
}

import type { Knex } from 'knex'

export async function up(knex: Knex): Promise<void> {
  return knex.schema.alterTable('cards', (table) => {
    table.string('additional_info', 200).nullable().alter()
  })
}

export async function down(knex: Knex): Promise<void> {
  return knex.schema.alterTable('cards', (table) => {
    table.string('additional_info', 50).nullable().alter()
  })
}

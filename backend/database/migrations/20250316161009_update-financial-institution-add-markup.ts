import type { Knex } from 'knex'

export async function up(knex: Knex): Promise<void> {
  await knex.schema.alterTable('financial_institutions', (table) => {
    table.decimal('markup', 5, 2).notNullable().defaultTo(0.0) // Ágio em percentual
  })
}

export async function down(knex: Knex): Promise<void> {
  await knex.schema.alterTable('financial_institutions', (table) => {
    table.dropColumn('markup')
  })
}

import type { Knex } from 'knex'

export async function up(knex: Knex): Promise<void> {
  await knex.schema.alterTable('simulations', (table) => {
    table.decimal('exchange_rate', 10, 4).nullable() // Cotação do dólar usada na simulação
  })
}

export async function down(knex: Knex): Promise<void> {
  await knex.schema.alterTable('simulations', (table) => {
    table.dropColumn('exchange_rate')
  })
}

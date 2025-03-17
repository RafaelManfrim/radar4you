import type { Knex } from 'knex'

export async function up(knex: Knex): Promise<void> {
  await knex.schema.alterTable('simulations', (table) => {
    table.string('product', 255).nullable() // Nome do produto da simulação (opcional)
  })
}

export async function down(knex: Knex): Promise<void> {
  await knex.schema.alterTable('simulations', (table) => {
    table.dropColumn('product')
  })
}

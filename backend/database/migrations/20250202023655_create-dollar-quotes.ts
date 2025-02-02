import type { Knex } from 'knex'

export async function up(knex: Knex): Promise<void> {
  await knex.schema.createTable('dollar_quotes', (table) => {
    table.uuid('id').primary()
    table.decimal('exchange_rate', 10, 4).notNullable() // Armazena a cotação com precisão de 4 casas decimais.
    table.timestamp('retrieved_at').notNullable().defaultTo(knex.fn.now()) // Data e hora da busca.
  })
}

export async function down(knex: Knex): Promise<void> {
  await knex.schema.dropTable('dollar_quotes')
}

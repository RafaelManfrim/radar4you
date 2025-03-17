import type { Knex } from 'knex'

export async function up(knex: Knex): Promise<void> {
  await knex.schema.alterTable('cards', (table) => {
    table.boolean('is_recommended').notNullable().defaultTo(false) // Indica se o cartão é recomendado
    table.decimal('annual_fee', 10, 2).nullable() // Valor da anuidade (NULL se não houver)
    table.text('benefits').nullable() // Benefícios do cartão (armazenados como JSON)
    table.text('vip_lounges').nullable() // Salas VIP acessíveis (armazenadas como JSON)
  })
}

export async function down(knex: Knex): Promise<void> {
  await knex.schema.alterTable('cards', (table) => {
    table.dropColumn('is_recommended')
    table.dropColumn('annual_fee')
    table.dropColumn('benefits')
    table.dropColumn('vip_lounges')
  })
}

import type { Knex } from 'knex'

export async function up(knex: Knex): Promise<void> {
  await knex.schema.createTable('simulation_cards', (table) => {
    table.uuid('id').primary()

    table
      .uuid('simulation_id')
      .notNullable()
      .references('id')
      .inTable('simulations')
      .onDelete('CASCADE') // Se a simulação for excluída, remove as associações

    table
      .uuid('card_id')
      .notNullable()
      .references('id')
      .inTable('cards')
      .onDelete('CASCADE') // Se o cartão for excluído, remove as associações

    table.decimal('required_spending', 10, 2).nullable() // Valor necessário para gastar mensalmente (retorno "monthly_spending")
    table.integer('required_months').nullable() // Tempo necessário para atingir os pontos desejados (retorno "period")
    table.integer('earned_points').nullable() // Pontos ganhos com a compra (retorno "purchase")

    table.unique(['simulation_id', 'card_id']) // Garante que a relação seja única
  })
}

export async function down(knex: Knex): Promise<void> {
  await knex.schema.dropTable('simulation_cards')
}

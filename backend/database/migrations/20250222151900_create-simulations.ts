import type { Knex } from 'knex'

export async function up(knex: Knex): Promise<void> {
  await knex.schema.createTable('simulations', (table) => {
    table.uuid('id').primary()

    table
      .uuid('user_id')
      .notNullable()
      .references('id')
      .inTable('users')
      .onDelete('CASCADE') // Se o usuário for excluído, suas simulações também serão

    table
      .enum('simulation_type', ['purchase', 'monthly_spending', 'period'])
      .notNullable()

    table.decimal('amount', 10, 2).nullable() // Valor da compra (usado em "purchase")
    table.integer('desired_points').nullable() // Pontos desejados (usado em "monthly_spending" e "period")
    table.decimal('monthly_spending', 10, 2).nullable() // Gasto mensal informado (usado em "period" e "purchase")
    table.integer('months').nullable() // Meses desejados para acumular pontos (usado em "monthly_spending")

    table.timestamps(true, true) // created_at e updated_at automáticos
  })
}

export async function down(knex: Knex): Promise<void> {
  await knex.schema.dropTable('simulations')
}

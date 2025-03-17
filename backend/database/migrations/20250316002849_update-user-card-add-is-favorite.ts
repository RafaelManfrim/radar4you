import type { Knex } from 'knex'

export async function up(knex: Knex): Promise<void> {
  await knex.schema.alterTable('user_cards', (table) => {
    table.boolean('is_favorite').notNullable().defaultTo(false)

    // Restringe para que um usuário tenha no máximo um cartão favorito
    // table.unique(['user_id'], { where: knex.raw('is_favorite = true') })
  })
}

export async function down(knex: Knex): Promise<void> {
  await knex.schema.alterTable('user_cards', (table) => {
    // table.dropUnique(['user_id'])
    table.dropColumn('is_favorite')
  })
}

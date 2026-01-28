import { BaseSchema } from '@adonisjs/lucid/schema'

export default class ProductExtras extends BaseSchema {
  protected tableName = 'product_extras'

  public async up () {
    this.schema.createTable(this.tableName, (table) => {
      table.increments('id')

      table
        .integer('product_id')
        .unsigned()
        .references('id')
        .inTable('products')
        .onDelete('CASCADE')

      table.string('name').notNullable()
      table.float('price_delta').notNullable().defaultTo(0)
      table.boolean('requires_text').notNullable().defaultTo(false)
      table.string('text_label').nullable()

      table.timestamp('created_at', { useTz: true })
      table.timestamp('updated_at', { useTz: true })
    })
  }

  public async down () {
    this.schema.dropTable(this.tableName)
  }
}
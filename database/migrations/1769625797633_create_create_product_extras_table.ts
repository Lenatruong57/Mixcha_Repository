import { BaseSchema } from '@adonisjs/lucid/schema'

export default class CreateProductExtrasTable extends BaseSchema {
  protected tableName = 'product_extras'

  public async up () {
    this.schema.createTable(this.tableName, (table) => {
      table.increments('id').primary()

      table
        .integer('product_id')
        .unsigned()
        .notNullable()
        .references('id')
        .inTable('products')
        .onDelete('CASCADE')

      table.string('name').notNullable()

      // Aufpreis (bei dir meistens 0, außer Gravur)
      table.float('price_delta').notNullable().defaultTo(0)

      // Falls ein Text eingegeben werden muss (Gravur)
      table.boolean('requires_text').notNullable().defaultTo(false)
      table.string('text_label').nullable()
    })
  }

  public async down () {
    this.schema.dropTable(this.tableName)
  }
}
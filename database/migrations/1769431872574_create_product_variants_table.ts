import { BaseSchema } from '@adonisjs/lucid/schema'

export default class extends BaseSchema {
  protected tableName = 'product_variants'

  async up() {
    this.schema.createTable(this.tableName, (table) => {
      table.increments('id')

      table
        .integer('product_id')
        .unsigned()
        .notNullable()
        .references('id')
        .inTable('products')
        .onDelete('CASCADE')

      table.string('name').notNullable()           // z.B. "50g"
      table.decimal('price', 10, 2).notNullable()  // Preis der Variante
    })
  }

  async down() {
    this.schema.dropTable(this.tableName)
  }
}
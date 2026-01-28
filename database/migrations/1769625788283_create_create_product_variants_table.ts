import { BaseSchema } from '@adonisjs/lucid/schema'

export default class CreateProductVariantsTable extends BaseSchema {
  protected tableName = 'product_variants'

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

      table.string('size').notNullable()   // z.B. "30g"
      table.float('price').notNullable()  // z.B. 19.9
    })
  }

  public async down () {
    this.schema.dropTable(this.tableName)
  }
}
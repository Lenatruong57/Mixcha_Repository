import { BaseSchema } from '@adonisjs/lucid/schema'

export default class DropSetsTable extends BaseSchema {
  protected tableName = 'sets'

  public async up () {
    this.schema.dropTableIfExists(this.tableName)
  }

  public async down () {
    // Falls du sets irgendwann wieder brauchst:
    this.schema.createTable(this.tableName, (table) => {
      table.increments('id')
      table
        .integer('product_id')
        .unsigned()
        .references('id')
        .inTable('products')
        .onDelete('CASCADE')

      table.string('color').nullable()
      table.string('engraving').nullable()
      table.float('extra_price').defaultTo(0)
    })
  }
}
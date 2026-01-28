import { BaseSchema } from '@adonisjs/lucid/schema'

export default class extends BaseSchema {
  protected tableName = 'customers'

  public async up () {
    this.schema.alterTable(this.tableName, (table) => {
      table.string('street')
      table.string('house_number')
      table.string('postal_code')
      table.string('city')
    })
  }

  public async down () {
    this.schema.alterTable(this.tableName, (table) => {
      table.dropColumn('street')
      table.dropColumn('house_number')
      table.dropColumn('postal_code')
      table.dropColumn('city')
    })
  }
}
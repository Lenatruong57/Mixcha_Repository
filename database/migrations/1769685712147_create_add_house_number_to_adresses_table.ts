import { BaseSchema } from '@adonisjs/lucid/schema'

export default class AddHouseNumberToAdresses extends BaseSchema {
  protected tableName = 'adresses'

  public async up() {
    this.schema.alterTable(this.tableName, (table) => {
      table.string('house_number', 20).nullable()
    })
  }

  public async down() {
    this.schema.alterTable(this.tableName, (table) => {
      table.dropColumn('house_number')
    })
  }
}
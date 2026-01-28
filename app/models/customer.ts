import { BaseModel, column } from '@adonisjs/lucid/orm'

export default class Customer extends BaseModel {
  @column({ isPrimary: true })
  declare id: number

  @column({ columnName: 'first_name' })
  declare firstName: string

  @column({ columnName: 'last_name' })
  declare lastName: string

  @column()
  declare email: string

  @column()
  declare password: string

  // bisher
  @column()
  declare address: string | null

  // ✅ neu
  @column()
  declare street: string | null

  @column({ columnName: 'house_number' })
  declare houseNumber: string | null

  @column({ columnName: 'postal_code' })
  declare postalCode: string | null

  @column()
  declare city: string | null

  @column()
  declare phone: string | null

  @column()
  declare avatar: string | null
}
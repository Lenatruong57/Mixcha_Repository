import { BaseModel, column } from '@adonisjs/lucid/orm'

export default class Product extends BaseModel {
  // Ihr habt in eurer products-Tabelle KEINE created_at/updated_at Spalten,
  // darum schalten wir timestamps aus (sonst passt Model <-> DB nicht sauber).
  public static timestamps = false

  @column({ isPrimary: true })
  declare id: number

  @column({ columnName: 'category_id' })
  declare categoryId: number

  @column()
  declare name: string

  @column()
  declare description: string | null

  @column({ columnName: 'base_price' })
  declare basePrice: number

  @column({ columnName: 'image_url' })
  declare imageUrl: string | null
}
import { BaseModel, column, hasMany } from '@adonisjs/lucid/orm'
import type { HasMany } from '@adonisjs/lucid/types/relations'
import ProductVariant from './product_variant.js'
import ProductExtra from './product_extra.js'


export default class Product extends BaseModel {
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

  @hasMany(() => ProductVariant)
  declare variants: HasMany<typeof ProductVariant>

  @hasMany(() => ProductExtra)
  declare extras: HasMany<typeof ProductExtra>
}
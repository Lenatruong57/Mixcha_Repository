import { DateTime } from 'luxon'
import { BaseModel, column, hasMany } from '@adonisjs/lucid/orm'
import type { HasMany } from '@adonisjs/lucid/types/relations'
import ProductVariant from '#models/product_variant'
import ProductExtra from '#models/product_extra'

export default class Product extends BaseModel {
  @column({ isPrimary: true })
  declare id: number

  @column()
  declare name: string

  @column({ columnName: 'base_price' })
  declare basePrice: number

  @column({ columnName: 'image_url' })
  declare imageUrl: string | null

  @column()
  declare description: string | null

  @hasMany(() => ProductVariant)
  declare variants: HasMany<typeof ProductVariant>

  @hasMany(() => ProductExtra)
  declare extras: HasMany<typeof ProductExtra>

  @column.dateTime({ autoCreate: true, columnName: 'created_at' })
  declare createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true, columnName: 'updated_at' })
  declare updatedAt: DateTime
}
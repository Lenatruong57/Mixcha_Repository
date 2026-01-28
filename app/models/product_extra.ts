import { DateTime } from 'luxon'
import { BaseModel, column, belongsTo } from '@adonisjs/lucid/orm'
import type { BelongsTo } from '@adonisjs/lucid/types/relations'
import Product from '#models/product'

export default class ProductExtra extends BaseModel {
  @column({ isPrimary: true })
  declare id: number

  @column({ columnName: 'product_id' })
  declare productId: number

  @column()
  declare name: string

  @column({ columnName: 'price_delta' })
  declare priceDelta: number

  @column({ columnName: 'requires_text' })
  declare requiresText: boolean

  @column({ columnName: 'text_label' })
  declare textLabel: string | null

  @belongsTo(() => Product)
  declare product: BelongsTo<typeof Product>

  @column.dateTime({ autoCreate: true, columnName: 'created_at' })
  declare createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true, columnName: 'updated_at' })
  declare updatedAt: DateTime
}
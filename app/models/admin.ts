import { BaseModel, column } from '@adonisjs/lucid/orm'

export default class Admin extends BaseModel {
  public static table = 'admins'

  @column({ isPrimary: true })
  declare id: number

  @column()
  declare username: string

  @column({ serializeAs: null })
  declare password: string
}



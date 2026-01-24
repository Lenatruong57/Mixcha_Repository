import { BaseSchema } from '@adonisjs/lucid/schema'

export default class BlogPosts extends BaseSchema {
  protected tableName = 'blog_posts'

  public async up () {
    this.schema.createTable(this.tableName, (table) => {
      table.increments('id')

      table.string('title').notNullable()
      table.string('teaser').notNullable()

      // Jerome: Bild-Dateiname (liegt in /public/avatars)
      table.string('image').notNullable()

      table.timestamp('created_at').defaultTo(this.now())
    })
  }

  public async down () {
    this.schema.dropTable(this.tableName)
  }
}
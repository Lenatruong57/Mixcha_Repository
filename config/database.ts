import env from '#start/env'
import { defineConfig } from '@adonisjs/lucid'

const databaseConfig = defineConfig({
  connection: 'sqlite',

  connections: {
    sqlite: {
      client: 'sqlite3',
      connection: {
        filename: env.get('DB_DATABASE', 'database/Mixcha_Datenbank.db.sqlite'),
      },
      useNullAsDefault: true,
    },
  },
})

export default databaseConfig
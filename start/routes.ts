/*
|--------------------------------------------------------------------------
| Routes file
|--------------------------------------------------------------------------
|
| The routes file is used for defining the HTTP routes.
|
*/

import router from '@adonisjs/core/services/router'
import db from '@adonisjs/lucid/services/db'

router.on('/').render('pages/home')

router.get('/test-db', async () => {
    const products = await db.from('products').select('*').limit(5)
    return products
  })
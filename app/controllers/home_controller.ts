import type { HttpContext } from '@adonisjs/core/http'
import Product from '#models/product'

export default class HomeController {
  public async index({ view }: HttpContext) {
    // 3 Produkte aus der Datenbank holen (z. B. die neuesten)
    const products = await Product.query()
      .orderBy('id', 'desc')
      .limit(3)

    return view.render('pages/home', { products })
  }
}
import type { HttpContext } from '@adonisjs/core/http'
import Product from '#models/product'

export default class ProdukteController {
  public async index({ view }: HttpContext) {
    const products = await Product.query().orderBy('id', 'asc')
    return view.render('pages/produkte', { products })
  }

  // Produkt-Detailseite
  public async show({ params, view, response }: HttpContext) {
    const id = Number(params.id)

    // Feste Spezialseiten
    if (id === 1) return view.render('pages/produkt_detail_premium')
    if (id === 2) return view.render('pages/produkt_detail_ceremonial')
    if (id === 3) return view.render('pages/produkt_detail_set')

    // Dynamische Produkte inkl. Varianten
    const product = await Product.query()
      .where('id', id)
      .first()

    if (!product) {
      return response.status(404).send('Not found')
    }

    return view.render('pages/produkt_detail_dynamic', { product })
  }
}
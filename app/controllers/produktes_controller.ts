import type { HttpContext } from '@adonisjs/core/http'
import db from '@adonisjs/lucid/services/db'

export default class ProdukteController {
  public async index({ view }: HttpContext) {
    const products = await db.from('products').select('*')

    return view.render('pages/produkte', {
      products,
    })
  }

  public async show({ params, view }: HttpContext) {
    const productId = params.id

    const product = await db.from('products').where('id', productId).first()

    if (!product) {
      return view.render('errors/not_found')
    }

    return view.render('pages/produkt_detail', {
      product,
    })
  }
}
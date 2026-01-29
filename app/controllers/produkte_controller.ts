import type { HttpContext } from '@adonisjs/core/http'
import Product from '#models/product'

export default class ProdukteController {
  public async index({ view }: HttpContext) {
    const products = await Product.query().orderBy('id', 'asc')
    return view.render('pages/produkte', { products })
  }
  
      public async show({ params, view, response}: HttpContext) {
        const product = await Product.query()
          .where('id', params.id)
          .preload('variants')
          .preload('extras')
          .firstOrFail()
    
        // du kannst weiter deine 3 spezial-templates behalten:
        if (product.id === 1) return view.render('pages/produkt_detail_premium', { product })
        if (product.id === 2) return view.render('pages/produkt_detail_ceremonial', { product })
        if (product.id === 3) return view.render('pages/produkt_detail_set', { product })
    
        // fallback
        return response.redirect('/produkte')
      }
    }
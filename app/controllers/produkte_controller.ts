import type { HttpContext } from '@adonisjs/core/http'

export default class ProdukteController {
  public async index({ view }: HttpContext) {
    return view.render('pages/produkte')
  }

  public async show({ params, view }: HttpContext) {
    const id = Number(params.id)

    if (id === 1) {
      return view.render('pages/produkt_detail_premium', {
        title: 'Premium Matcha – Mixcha',
        pageCss: 'produkt_detail.css',
        basePrice: '19,90',
      })
    }

    if (id === 2) {
      return view.render('pages/produkt_detail_ceremonial', {
        title: 'Ceremonial Matcha – Mixcha',
        pageCss: 'produkt_detail.css',
        basePrice: '25,90',
      })
    }

    if (id === 3) {
      return view.render('pages/produkt_detail_set', {
        title: 'Matcha Traditional Set – Mixcha',
        pageCss: 'produkt_detail.css',
        basePrice: '39,90',
      })
    }

    return view.render('errors/not_found')
  }
}
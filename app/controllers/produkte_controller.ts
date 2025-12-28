import type { HttpContext } from '@adonisjs/core/http'

export default class ProdukteController {
  public async index({ view }: HttpContext) {
    return view.render('pages/produkte', {
      title: 'Unsere Produkte – Mixcha',
      pageCss: 'produkte.css',
    })
  }

  public async show(ctx: HttpContext) {
    const id = Number(ctx.params.id)

    if (id === 1) {
      return ctx.view.render('pages/produkt_detail_premium', {
        title: 'Premium Matcha – Mixcha',
        pageCss: 'produkt_detail.css',
        price: '19,90 €',
      })
    }

    if (id === 2) {
      return ctx.view.render('pages/produkt_detail_ceremonial', {
        title: 'Ceremonial Matcha – Mixcha',
        pageCss: 'produkt_detail.css',
        price: '25,90 €',
      })
    }

    if (id === 3) {
      return ctx.view.render('pages/produkt_detail_set', {
        title: 'Matcha Traditional Set – Mixcha',
        pageCss: 'produkt_detail.css',
        price: '39,90 €',
      })
    }

    return ctx.view.render('errors/not_found')
  }
}
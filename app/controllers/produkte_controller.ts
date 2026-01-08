import type { HttpContext } from '@adonisjs/core/http'

export default class ProdukteController {
  public async index({ view }: HttpContext) {
    return view.render('pages/produkte')
  }

  public async show({ params, view }: HttpContext) {
    const id = Number(params.id)

    if (id === 1) return view.render('pages/produkt_detail_premium')
    if (id === 2) return view.render('pages/produkt_detail_ceremonial')

    // id === 3 später (Traditional Set)
    return view.render('errors/not_found')
  }
}
import type { HttpContext } from '@adonisjs/core/http'

export default class ProdukteController {
  public async index({ view }: HttpContext) {
    return view.render('pages/produkte')
  }

  // Produkt-Detailseite
  public async show({ params, view }: HttpContext) {
    const id = Number(params.id)

    // Feste Spezialseiten
    if (id === 1) return view.render('pages/produkt_detail_premium')
    if (id === 2) return view.render('pages/produkt_detail_ceremonial')
    if (id === 3) return view.render('pages/produkt_detail_set')




}} 
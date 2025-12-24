import type { HttpContext } from '@adonisjs/core/http'

export default class ProdukteController {
  public async index({ view }: HttpContext) {
    return view.render('pages/produkte')
  }
}
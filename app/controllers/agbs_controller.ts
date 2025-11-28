import type { HttpContext } from '@adonisjs/core/http'

export default class AgbsController {
  public async index({ view }: HttpContext) {
    return view.render('pages/agb')
  }
}
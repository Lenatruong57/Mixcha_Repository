import type { HttpContext } from '@adonisjs/core/http'

export default class DatenschutzsController {
  public async index({ view }: HttpContext) {
    return view.render('pages/datenschutz')
  }
}
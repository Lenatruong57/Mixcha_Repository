import type { HttpContext } from '@adonisjs/core/http'

export default class ImpressumsController {
  public async index({ view }: HttpContext) {
    return view.render('pages/impressum')
  }
}
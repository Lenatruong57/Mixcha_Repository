import type { HttpContext } from '@adonisjs/core/http'

export default class HomeController {
  public async index({ session, view }: HttpContext) {
    // 🔥 HIER der Schlüssel
    session.forget('adminId')
    session.forget('customerId')

    return view.render('pages/home')
  }
}
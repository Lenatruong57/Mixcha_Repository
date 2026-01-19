import type { HttpContext } from '@adonisjs/core/http'
import Customer from '#models/customer'

export default class UserController {
    //GET /profil
  public async index({ view, session, response }: HttpContext) {
    const customerId = session.get('customerId')

    const customer = await Customer.find(customerId)

    if (!customer) {
      session.forget('customerId')
      return response.redirect('/login')
    }

    return view.render('pages/profil', { customer })
  }
}

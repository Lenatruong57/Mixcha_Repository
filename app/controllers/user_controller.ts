import type { HttpContext } from '@adonisjs/core/http'
import db from '@adonisjs/lucid/services/db'

export default class UserController {
  public async index({ view }: HttpContext) {
    return view.render('pages/login')
  }

  public async login({ request, response, session }: HttpContext) {
    const email = request.input('email')
    const password = request.input('password')

    const user = await db
      .from('customers')
      .where('email', email)
      .andWhere('password', password)
      .first()

    if (!user) {
      session.flash({ error: 'Login fehlgeschlagen! Email oder Passwort falsch.' })
      return response.redirect('/login')
    }

    session.put('user', user)

    return response.redirect('/')
  }

  public async logout({ session, response }: HttpContext) {
    session.forget('user')
    return response.redirect('/')
  }
}
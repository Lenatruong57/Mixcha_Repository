import type { HttpContext } from '@adonisjs/core/http'
import db from '@adonisjs/lucid/services/db'

export default class LoginController {
  // Login-Seite anzeigen
  public async index({ view }: HttpContext) {
    return view.render('pages/login')
  }

  // Login-Formular auswerten (sehr simpel!)
  public async login({ request, session, response }: HttpContext) {
    const username = request.input('username')
    const password = request.input('password')

    const admin = await db
      .from('admins')
      .where({ username, password })
      .first()

    if (!admin) {
      session.flash('error', 'Login fehlgeschlagen')
      return response.redirect('/login')
    }

    session.put('admin_id', admin.id)
    return response.redirect('/') // oder /admin
  }

  // Logout
  public async logout({ session, response }: HttpContext) {
    session.forget('admin_id')
    return response.redirect('/')
  }
}
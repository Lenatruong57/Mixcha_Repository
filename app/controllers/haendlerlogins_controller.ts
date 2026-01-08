import type { HttpContext } from '@adonisjs/core/http'
import Admin from '#models/admin'
import hash from '@adonisjs/core/services/hash'

export default class HaendlerloginsController {
  public async index({ view }: HttpContext) {
    return view.render('pages/login_haendler')
  }

  public async login({ request, session, response }: HttpContext) {
    const username = request.input('username')
    const password = request.input('password')

    if (!username || !password) {
      session.flash('error', 'Bitte ausfüllen.')
      return response.redirect().back()
    }

    const admin = await Admin.findBy('username', username)
    if (!admin) {
      session.flash('error', 'Login fehlgeschlagen.')
      return response.redirect().back()
    }

    const ok = await hash.verify(admin.password, password)
    if (!ok) {
      session.flash('error', 'Login fehlgeschlagen.')
      return response.redirect().back()
    }

    // Händler ist eingeloggt
    session.put('adminId', admin.id)

    return response.redirect('/admin')
  }

  public async logout({ session, response }: HttpContext) {
    session.forget('adminId')
    return response.redirect('/')
  }
}
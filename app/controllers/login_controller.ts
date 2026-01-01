import type { HttpContext } from '@adonisjs/core/http'
import db from '@adonisjs/lucid/services/db'

export default class LoginController {
  // ===== KUNDE =====
  public async index({ view }: HttpContext) {
    return view.render('pages/login')
  }

  public async loginCustomer({ request, session, response }: HttpContext) {
    const email = request.input('email')
    const password = request.input('password')

    const customer = await db
      .from('customers')
      .where({ email, password })
      .first()

    if (!customer) {
      session.flash('error', 'Login fehlgeschlagen (Kunde)')
      return response.redirect('/login')
    }

    session.put('customer_id', customer.id)
    return response.redirect('/') // oder /kundenbereich
  }

  // ===== HÄNDLER / ADMIN =====
  public async haendlerIndex({ view }: HttpContext) {
    return view.render('pages/login_haendler')
  }

  public async loginHaendler({ request, session, response }: HttpContext) {
    const username = request.input('username')
    const password = request.input('password')

    const admin = await db
      .from('admins')
      .where({ username, password })
      .first()

    if (!admin) {
      session.flash('error', 'Login fehlgeschlagen (Händler)')
      return response.redirect('/haendler/login')
    }

    session.put('admin_id', admin.id)
    return response.redirect('/admin') // falls du ein Admin-Dashboard hast
  }

  public async logout({ session, response }: HttpContext) {
    session.forget('customer_id')
    session.forget('admin_id')
    return response.redirect('/')
  }
}



import type { HttpContext } from '@adonisjs/core/http'
import hash from '@adonisjs/core/services/hash'
import Customer from '#models/customer'
import db from '@adonisjs/lucid/services/db'

export default class LoginController {

  // =========================
  // KUNDE
  // =========================

  // GET /login
  public async index({ view }: HttpContext) {
    return view.render('pages/login')
  }

  // POST /login
  public async loginCustomer({ request, session, response }: HttpContext) {
    const email = request.input('email')
    const password = request.input('password')

    // 1) Kunde über E-Mail finden
    const customer = await Customer.findBy('email', email)

    if (!customer) {
      session.flash('error', 'Login fehlgeschlagen (Kunde)')
      return response.redirect('/login')
    }

    // 2) Passwort-Hash prüfen
    const passwordOk = await hash.verify(customer.password, password)

    if (!passwordOk) {
      session.flash('error', 'Login fehlgeschlagen (Kunde)')
      return response.redirect('/login')
    }

    // 3) Kunde einloggen (Session)
    session.put('customerId', customer.id)
    return response.redirect('/') // oder /user
  }

  // POST /logout (Kunde)
  public async logoutCustomer({ session, response }: HttpContext) {
    session.forget('customer_id')
    return response.redirect('/')
  }

  // =========================
  // HÄNDLER / ADMIN
  // =========================

  // GET /haendler-login
  public async haendlerIndex({ view }: HttpContext) {
    return view.render('pages/login_haendler')
  }

  // POST /haendler-login
  public async loginHaendler({ request, session, response }: HttpContext) {
    const username = request.input('username')
    const password = request.input('password')

    // Admin suchen (hier bewusst einfach gehalten)
    const admin = await db
      .from('admins')
      .where({ username })
      .first()

    if (!admin) {
      session.flash('error', 'Login fehlgeschlagen (Händler)')
      return response.redirect('/haendler-login')
    }

    // Passwort prüfen (falls Admin auch gehasht ist)
    const passwordOk = await hash.verify(admin.password, password)

    if (!passwordOk) {
      session.flash('error', 'Login fehlgeschlagen (Händler)')
      return response.redirect('/haendler-login')
    }

    // Admin einloggen
    session.put('admin_id', admin.id)

    return response.redirect('/admin')
  }

  public async logout({ session, response }: HttpContext) {
  session.forget('customerId')
session.forget('adminId')
  return response.redirect('/')
}
}

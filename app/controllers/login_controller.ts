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
  console.log('LOGIN CUSTOMER START')

  const email = request.input('email')
  const password = request.input('password')

  const customer = await Customer.findBy('email', email)

  if (!customer) {
    session.flash('error', 'E-Mail oder Passwort ist falsch.')
    return response.redirect('/login')
  }

  const ok = await hash.verify(customer.password, password)

  if (!ok) {
    session.flash('error', 'E-Mail oder Passwort ist falsch.')
    return response.redirect('/login')
  }

 // andere Rolle sicher entfernen
session.forget('adminId')

// Session setzen
session.put('customerId', customer.id)

return response.redirect('/')
}

  // POST /logout (Kunde)
  public async logoutCustomer({ session, response }: HttpContext) {
  session.forget('customerId')
  session.forget('adminId')
  return response.redirect('/login')
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

    const admin = await db.from('admins').where({ username }).first()

    if (!admin) {
      session.flash('error', 'Benutzername oder Passwort ist falsch.')
      return response.redirect('/haendler-login')
    }

    const ok = await hash.verify(admin.password, password)

    if (!ok) {
      session.flash('error', 'Benutzername oder Passwort ist falsch.')
      return response.redirect('/haendler-login')
    }

    // andere Rolle entfernen
    session.forget('customerId')

    session.put('adminId', admin.id)

    return response.redirect('/admin')
  }

  // POST /haendler-logout
  public async logoutHaendler({ session, response }: HttpContext) {
  session.forget('adminId')
  session.forget('customerId')
  return response.redirect('/haendler-login')
}
}
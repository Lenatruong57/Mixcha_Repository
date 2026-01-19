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

  const customer = await Customer.findBy('email', email)
  if (!customer) {
    session.flash('error', 'E-Mail oder Passwort ist falsch.')
    await session.commit()
    return response.redirect().toPath('/login')
  }

  const ok = await hash.verify(customer.password, password)
  if (!ok) {
    session.flash('error', 'E-Mail oder Passwort ist falsch.')
    await session.commit()
    return response.redirect().toPath('/login')
  }

  session.forget('adminId')
  session.put('customerId', customer.id)

  await session.commit()
  return response.redirect().toPath('/')
}

// POST /logout
public async logoutCustomer({ session, response }: HttpContext) {
  session.forget('customerId')
  await session.commit()
  return response.redirect().toPath('/login')
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
    await session.commit()
    return response.redirect().toPath('/haendler-login')
  }

  const ok = await hash.verify(admin.password, password)
  if (!ok) {
    session.flash('error', 'Benutzername oder Passwort ist falsch.')
    await session.commit()
    return response.redirect().toPath('/haendler-login')
  }

  session.forget('customerId')
  session.put('adminId', admin.id)

  await session.commit()
  return response.redirect().toPath('/admin')
}

// POST /haendler-logout
public async logoutHaendler({ session, response }: HttpContext) {
  session.forget('adminId')
  await session.commit()
  return response.redirect().toPath('/haendler-login')
}}
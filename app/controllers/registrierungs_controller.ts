import type { HttpContext } from '@adonisjs/core/http'
import Customer from '#models/customer'
import hash from '@adonisjs/core/services/hash'
export default class RegistrierungsController {

  // GET /registrieren
  public async index({ view }: HttpContext) {
    return view.render('pages/registrieren')
  }

  // POST /registrieren
  public async register({ request, session, response }: HttpContext) {
  const firstName = request.input('first_name')
  const lastName = request.input('last_name')
  const email = request.input('email')
  const password = request.input('password')
  const password2 = request.input('password2')

  // 1) check: alles ausgefüllt?
  if (!firstName || !lastName || !email || !password) {
    session.flash('error', 'Bitte alle Felder ausfüllen.')
    return response.redirect().back()
  }

  // 2) passwörter gleich?
  if (password !== password2) {
    session.flash('error', 'Passwörter stimmen nicht überein.')
    return response.redirect().back()
  }

  // 3) email schon vorhanden?
  const existingCustomer = await Customer.findBy('email', email)
  if (existingCustomer) {
    session.flash('error', 'Diese E-Mail ist bereits registriert.')
    return response.redirect().back()
  }

  // 4) speichern in customers
  await Customer.create({
    firstName: firstName,
    lastName: lastName,
    email: email,
    password: await hash.make(password),
  })

  session.flash('success', 'Registrierung erfolgreich! Bitte einloggen.')
  return response.redirect('/login')
  }
}
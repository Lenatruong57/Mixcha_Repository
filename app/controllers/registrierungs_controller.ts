import type { HttpContext } from '@adonisjs/core/http'
import Customer from '#models/customer'
import hash from '@adonisjs/core/services/hash'
import fs from 'fs'
import path from 'path'

export default class RegistrierungsController {
  // GET /registrieren
  public async index({ view }: HttpContext) {
    return view.render('pages/registrieren')
  }

  // POST /registrieren
  public async register({ request, session, response }: HttpContext) {
    const firstName = (request.input('first_name') || '').trim()
    const lastName  = (request.input('last_name') || '').trim()
    const email = (request.input('email') || '').trim().toLowerCase() 
    const password  = (request.input('password') || '').trim()
    const password2 = (request.input('password2') || '').trim()

    // Identifizierung der Vollständigkeit
    if (!firstName || !lastName || !email || !password || !password2) {
      session.flash('error', 'Bitte alle Felder ausfüllen.')
      return response.redirect().back()
    }

    // Passwörter gleich?
    if (password !== password2) {
      session.flash('error', 'Passwörter stimmen nicht überein.')
      return response.redirect().back()
    }

    // Passwortlänge prüfen 
    if (password.length < 8) {
      session.flash('error', 'Das Passwort muss mindestens 8 Zeichen lang sein.')
      return response.redirect().back()
    }

    // Verhinderung von Redundanz der E-Mail
    const existingCustomer = await Customer.findBy('email', email)
    if (existingCustomer) {
      session.flash('error', 'Diese E-Mail ist bereits registriert.')
      return response.redirect().back()
    }

    // Speicherung des Kunden 
    const customer = await Customer.create({
      firstName: firstName,
      lastName: lastName,
      email: email,
      password: await hash.make(password),
    })

    // Default Profilbild einfügen
    const source = path.join(process.cwd(), 'public', 'avatars', 'default.jpg')
    const target = path.join(process.cwd(), 'public', 'avatars', `avatar_${customer.id}.jpg`)

    // Check falls default.jpg fehlt
    if (fs.existsSync(source)) {
      fs.copyFileSync(source, target)
    } else {
      console.log('WARN: default.jpg fehlt in public/avatars/')
    }

    session.flash('success', 'Registrierung erfolgreich! Bitte einloggen.')
    return response.redirect('/login')
  }
}
import type { HttpContext } from '@adonisjs/core/http'
import Customer from '#models/customer'

export default class UserController {
  // =========================
  // PROFIL ANZEIGEN
  // =========================
  // GET /profil
  public async index({ view, session, response }: HttpContext) {
    const customerId = session.get('customerId')

    if (!customerId) {
      return response.redirect('/login')
    }

    const customer = await Customer.find(customerId)

    if (!customer) {
      session.forget('customerId')
      return response.redirect('/login')
    }

    return view.render('pages/profil', { customer })
  }

  // =========================
  // PROFIL BEARBEITEN (FORMULAR)
  // =========================
  // GET /profil/edit
  public async edit({ view, session, response }: HttpContext) {
    const customerId = session.get('customerId')

    if (!customerId) {
      return response.redirect('/login')
    }

    const customer = await Customer.find(customerId)

    if (!customer) {
      session.forget('customerId')
      return response.redirect('/login')
    }

    return view.render('pages/profil_edit', { customer })
  }

  // =========================
  // PROFIL SPEICHERN
  // =========================
  // POST /profil
  public async update({ request, session, response }: HttpContext) {
    const customerId = session.get('customerId')
    if (!customerId) return response.redirect('/login')

    const customer = await Customer.find(customerId)
    if (!customer) {
      session.forget('customerId')
      return response.redirect('/login')
    }

    // Pflichtfelder
    const firstName = request.input('first_name')
    const lastName = request.input('last_name')

    // Optionale Felder
    const address = request.input('address') || null
    const phone = request.input('phone') || null

    if (!firstName || !lastName) {
      session.flash('error', 'Bitte Vorname und Nachname ausfüllen.')
      return response.redirect('/profil/edit')
    }

    // =========================
    // PROFILBILD
    // =========================
    // Profilbild
    const avatar = request.file('avatar', {
      size: '10mb', // <- höher (z.B. 10mb)
      extnames: ['jpg', 'jpeg', 'png', 'webp'],
    })

    if (avatar) {
      if (!avatar.isValid) {
        // hier bekommst du z.B. size / extension Fehler
        session.flash('error', avatar.errors.map((e) => e.message).join(' | '))
        return response.redirect('/profil/edit')
      }

      await avatar.move('public/avatars', {
        name: `avatar_${customerId}.${avatar.extname}`, // richtige Endung behalten
        overwrite: true,
      })

      customer.avatar = `avatar_${customerId}.${avatar.extname}`
    }

    // =========================
    // DATEN SPEICHERN
    // =========================
    customer.firstName = firstName
    customer.lastName = lastName
    customer.address = address
    customer.phone = phone

    await customer.save()

    session.flash('success', 'Profil erfolgreich gespeichert.')
    return response.redirect('/profil')
  }
}
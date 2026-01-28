import type { HttpContext } from '@adonisjs/core/http'
import Customer from '#models/customer'

export default class UserController {
  // GET /profil
  public async index({ view, session, response }: HttpContext) {
    const customerId = session.get('customerId')
    if (!customerId) return response.redirect('/login')

    const customer = await Customer.find(customerId)
    if (!customer) {
      session.forget('customerId')
      return response.redirect('/login')
    }

    return view.render('pages/profil', { customer })
  }

  // GET /profil/edit
  public async edit({ view, session, response }: HttpContext) {
    const customerId = session.get('customerId')
    if (!customerId) return response.redirect('/login')

    const customer = await Customer.find(customerId)
    if (!customer) {
      session.forget('customerId')
      return response.redirect('/login')
    }

    return view.render('pages/profil_edit', { customer })
  }

  // POST /profil
  public async update({ request, session, response }: HttpContext) {
    const customerId = session.get('customerId')
    if (!customerId) return response.redirect('/login')

    const customer = await Customer.find(customerId)
    if (!customer) {
      session.forget('customerId')
      return response.redirect('/login')
    }

    const firstName = (request.input('first_name') || '').trim()
    const lastName = (request.input('last_name') || '').trim()

    const street = (request.input('street') || '').trim() || null
    const houseNumber = (request.input('house_number') || '').trim() || null
    const postalCode = (request.input('postal_code') || '').trim() || null
    const city = (request.input('city') || '').trim() || null
    const phone = (request.input('phone') || '').trim() || null

    if (!firstName || !lastName) {
      session.flash('error', 'Bitte Vorname und Nachname ausfüllen.')
      return response.redirect('/profil/edit')
    }

    // Avatar Upload (optional)
    const avatar = request.file('avatar', {
      size: '10mb',
      extnames: ['jpg', 'jpeg', 'png', 'webp'],
    })

    if (avatar) {
      if (!avatar.isValid) {
        session.flash('error', avatar.errors.map((e) => e.message).join(' | '))
        return response.redirect('/profil/edit')
      }

      await avatar.move('public/avatars', {
        name: `avatar_${customerId}.${avatar.extname}`,
        overwrite: true,
      })

      customer.avatar = `avatar_${customerId}.${avatar.extname}`
    }

    customer.firstName = firstName
    customer.lastName = lastName
    customer.street = street
    customer.houseNumber = houseNumber
    customer.postalCode = postalCode
    customer.city = city
    customer.phone = phone

    await customer.save()

    session.flash('success', 'Profil erfolgreich gespeichert.')
    return response.redirect('/profil')
  }
}
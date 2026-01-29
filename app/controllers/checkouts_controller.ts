import type { HttpContext } from '@adonisjs/core/http'
import db from '@adonisjs/lucid/services/db'
import Customer from '#models/customer'

type CartItem = {
  key: string
  productId: number
  name: string
  imageUrl: string
  unitPrice: number
  quantity: number
  extras?: string
  size?: string
  color?: string
  engraving?: string
  engravingPrice?: number
}

export default class CheckoutsController {
  private shipping = 3.99

  private calcSubtotal(cartItems: CartItem[]) {
    return cartItems.reduce((sum, item) => {
      const engrave = item.engravingPrice ? Number(item.engravingPrice) : 0
      return sum + (Number(item.unitPrice) + engrave) * Number(item.quantity)
    }, 0)
  }

  private calcDiscount(subtotal: number, coupon?: string) {
    if (!coupon) return 0
    if (coupon.toLowerCase() === 'mixcha10') return subtotal * 0.1
    return 0
  }

  // GET /checkout
  public async index({ view, session }: HttpContext) {
    const cartItems: CartItem[] = session.get('cart', [])
    const coupon: string | null = session.get('coupon', null)

    const subtotal = this.calcSubtotal(cartItems)
    const discount = this.calcDiscount(subtotal, coupon ?? undefined)
    const shipping = cartItems.length > 0 ? this.shipping : 0
    const total = Math.max(0, subtotal - discount + shipping)

    let customer: Customer | null = null
    const customerId = session.get('customerId') as number | undefined
    if (customerId) {
      customer = await Customer.find(customerId)
    }

    return view.render('pages/checkout', {
      cartItems,
      coupon,
      subtotal,
      discount,
      shipping,
      total,
      customer,
      invalidCoupon: session.flashMessages.get('invalidCoupon'),
    })
  }

  // POST /checkout/coupon
  public async applyCoupon({ request, session, response }: HttpContext) {
    const code = String(request.input('coupon', '')).trim()

    if (!code) {
      session.forget('coupon')
      return response.redirect('/checkout')
    }

    if (code.toLowerCase() !== 'mixcha10') {
      session.flash('invalidCoupon', 'Ungültiger Code.')
      session.forget('coupon')
      return response.redirect('/checkout')
    }

    session.put('coupon', code)
    return response.redirect('/checkout')
  }

  // POST /checkout/process
  public async process({ request, session, response }: HttpContext) {
    const cartItems: CartItem[] = session.get('cart', [])
    if (cartItems.length === 0) return response.redirect('/warenkorb')

    // === Form fields (passen zu deinem checkout.edge) ===
    const email = String(request.input('email') ?? '').trim().toLowerCase()
    const firstName = String(request.input('first_name') ?? '').trim()
    const lastName = String(request.input('last_name') ?? '').trim()
    const street = String(request.input('street') ?? '').trim()
    const houseNumber = String(request.input('house_number') ?? '').trim()
    const postalCode = String(request.input('postal_code') ?? '').trim()
    const city = String(request.input('city') ?? '').trim()

    // Optional: eingeloggter Kunde?
    let customerId = session.get('customerId') as number | undefined

    // === 1) Kunde anlegen oder aktualisieren (alles in customers) ===
    if (!customerId) {
      // Gast: Customer erstellen
      const [newCustomerId] = await db.table('customers').insert({
        first_name: firstName,
        last_name: lastName,
        email,
        password: 'dummy', // nur wenn NOT NULL
        street,
        house_number: houseNumber,
        postal_code: postalCode,
        city,
      })

      // ✅ FIX: cast auf number, damit session.put kein undefined/other types bekommt
      customerId = Number(newCustomerId)

      // Optional aber praktisch: direkt einloggen
      session.put('customerId', customerId)
    } else {
      // Eingeloggt: Customer updaten (damit ALLE Felder mitkommen)
      await db
        .from('customers')
        .where('id', customerId)
        .update({
          first_name: firstName,
          last_name: lastName,
          email,
          street,
          house_number: houseNumber,
          postal_code: postalCode,
          city,
        })
    }

    // === 2) Order anlegen ===
    const [orderId] = await db.table('orders').insert({
      customer_id: customerId,
      created_at: new Date().toISOString(),
      status: 'offen',
    })

    // === 3) Order Items ===
    for (const item of cartItems) {
      await db.table('order_items').insert({
        order_id: orderId,
        product_id: item.productId,
        quantity: item.quantity,
      })
    }

    // === 4) Session leeren ===
    session.forget('cart')
    session.forget('coupon')

    return response.redirect('/checkout/success')
  }

  // GET /checkout/success
  public async success({ view }: HttpContext) {
    return view.render('pages/checkout_success')
  }
}
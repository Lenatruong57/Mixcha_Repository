import type { HttpContext } from '@adonisjs/core/http'
import db from '@adonisjs/lucid/services/db'

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

  public async index({ view, session }: HttpContext) {
    const cartItems: CartItem[] = session.get('cart', [])
    const coupon: string | null = session.get('coupon', null)

    const subtotal = this.calcSubtotal(cartItems)
    const discount = this.calcDiscount(subtotal, coupon ?? undefined)
    const shipping = cartItems.length > 0 ? this.shipping : 0
    const total = Math.max(0, subtotal - discount + shipping)

    return view.render('pages/checkout', {
      cartItems,
      coupon,
      subtotal,
      discount,
      shipping,
      total,
      invalidCoupon: session.flashMessages.get('invalidCoupon'),
    })
  }

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

  public async process({ request, session, response }: HttpContext) {
    const cartItems: CartItem[] = session.get('cart', [])
    if (cartItems.length === 0) return response.redirect('/warenkorb')

    // Form fields
    const email = String(request.input('email')).trim()
    const firstName = String(request.input('first_name')).trim()
    const lastName = String(request.input('last_name')).trim()
    const street = String(request.input('street')).trim()
    const zip = String(request.input('zip')).trim()
    const city = String(request.input('city')).trim()
    const country = String(request.input('country')).trim()

    // Optional: wenn Kunde eingeloggt ist, nutze ihn
    let customerId = session.get('customerId') as number | undefined

    if (!customerId) {
      // minimal "vorlesungskonform": Kunde anlegen (wenn ihr später Auth macht, kann das weg)
      const [newCustomerId] = await db.table('customers').insert({
        first_name: firstName,
        last_name: lastName,
        email,
        password: 'dummy', // falls bei euch NOT NULL ist
      })
      customerId = newCustomerId
    }

    await db.table('addresses').insert({
      customer_id: customerId,
      street,
      zip,
      city,
      country,
    })

    const [orderId] = await db.table('orders').insert({
      customer_id: customerId,
      created_at: new Date().toISOString(),
      status: 'offen',
    })

    // Order Items aus Session-Warenkorb
    for (const item of cartItems) {
      await db.table('order_items').insert({
        order_id: orderId,
        product_id: item.productId,
        quantity: item.quantity,
      })
    }

    // Warenkorb leeren
    session.forget('cart')
    session.forget('coupon')

    return response.redirect('/checkout/success')
  }

  public async success({ view }: HttpContext) {
    return view.render('pages/checkout_success')
  }
}
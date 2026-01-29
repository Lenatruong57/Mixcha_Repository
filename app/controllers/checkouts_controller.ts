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
  variantId?: number
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
        password: null,
        street,
        house_number: houseNumber,
        postal_code: postalCode,
        city,
      })

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

    // === Jerome: wir merken uns die neu erstellten Orders, damit success() sie anzeigen kann ===
    const createdOrderIds: number[] = []

    const coupon: string | null = session.get('coupon', null)

    // === 2) Orders + Items anlegen (DB-Design: pro Order genau 1 order_items Zeile) ===
    for (let i = 0; i < cartItems.length; i++) {
      const item = cartItems[i]

      const engrave = item.engravingPrice ? Number(item.engravingPrice) : 0
      const lineSubtotal = (Number(item.unitPrice) + engrave) * Number(item.quantity)

      const lineShipping = i === 0 ? this.shipping : 0
      const lineDiscount = i === 0 ? this.calcDiscount(lineSubtotal, coupon ?? undefined) : 0
      const lineTotal = Math.max(0, lineSubtotal - lineDiscount + lineShipping)

      const [orderId] = await db.table('orders').insert({
        customer_id: customerId,
        status: 'offen',
        order_date: new Date().toISOString(),
        subtotal: lineSubtotal,
        shipping: lineShipping,
        total: lineTotal,
      })

      const safeOrderId = Number(orderId)
      createdOrderIds.push(safeOrderId)

      await db.table('order_items').insert({
        order_id: safeOrderId,
        product_id: item.productId,
        quantity: item.quantity,
        variant_id: Number(item.variantId ?? 1),
      })
    }

    // === Jerome: Order-IDs für die Success-Seite speichern ===
    session.put('lastOrderIds', createdOrderIds)

    // === Jerome: Snapshot für Success-Seite (Preise aus Session/Warenkorb inkl. Extras & Coupon) ===
    const subtotalAll = this.calcSubtotal(cartItems)
    const discountAll = this.calcDiscount(subtotalAll, coupon ?? undefined)
    const shippingAll = cartItems.length > 0 ? this.shipping : 0
    const totalAll = Math.max(0, subtotalAll - discountAll + shippingAll)

    const itemsSnapshot: Array<{ name: string; imageUrl: string; quantity: number; price: number }> = cartItems.map(
      (it) => {
        const engrave = it.engravingPrice ? Number(it.engravingPrice) : 0
        const linePrice = (Number(it.unitPrice) + engrave) * Number(it.quantity)
        return {
          name: it.name,
          imageUrl: it.imageUrl,
          quantity: Number(it.quantity),
          price: Number(linePrice),
        }
      }
    )

    session.put('lastCheckoutSummary', {
      customer: {
        first_name: firstName,
        last_name: lastName,
        email,
        street,
        house_number: houseNumber,
        postal_code: postalCode,
        city,
      },
      items: itemsSnapshot,
      subtotal: subtotalAll,
      discount: discountAll,
      shipping: shippingAll,
      total: totalAll,
      totalSum: totalAll,
      shippingSum: shippingAll,
    })
    // === Jerome ===

    // === 4) Session leeren ===
    session.forget('cart')
    session.forget('coupon')

    return response.redirect('/checkout/success')
  }

  // GET /checkout/success
  public async success({ view, session }: HttpContext) {
    // === Jerome: Wenn Snapshot vorhanden ist, Success-Seite daraus rendern (statt DB-Preise) ===
    const summary = session.get('lastCheckoutSummary') as
      | {
          customer: any
          items: Array<{ name: string; imageUrl: string; quantity: number; price: number }>
          totalSum: number
          shippingSum: number
          subtotal?: number
          discount?: number
          shipping?: number
          total?: number
        }
      | undefined

    if (summary) {
      // optional: nach Anzeige löschen, damit Reload nicht wieder alte Bestellung zeigt
      session.forget('lastCheckoutSummary')

      return view.render('pages/checkout_success', {
        customer: summary.customer,
        items: summary.items,
        totalSum: summary.totalSum,
        shippingSum: summary.shippingSum,
        // falls du es im Edge anzeigen willst (optional):
        subtotal: summary.subtotal,
        discount: summary.discount,
        shipping: summary.shipping,
        total: summary.total,
      })
    }
    // === Jerome ===

    // === Jerome: Order-IDs aus Session holen und Daten aus DB laden ===
    const orderIds = (session.get('lastOrderIds') as number[] | undefined) ?? []
    const customerId = session.get('customerId') as number | undefined

    let customer: any = null
    if (customerId) {
      customer = await db.from('customers').where('id', customerId).first()
    }

    let items: Array<{ name: string; imageUrl: string; quantity: number; price: number }> = []
    let totalSum = 0
    let shippingSum = 0

    if (orderIds.length > 0) {
      const orders = await db.from('orders').whereIn('id', orderIds)
      totalSum = orders.reduce((s, o) => s + Number(o.total ?? 0), 0)
      shippingSum = orders.reduce((s, o) => s + Number(o.shipping ?? 0), 0)

      const rows = await db
        .from('order_items')
        .whereIn('order_items.order_id', orderIds)
        .join('products', 'products.id', 'order_items.product_id')
        .select(
          'products.name as name',
          'products.image_url as image_url',
          'order_items.quantity as quantity',
          'products.base_price as base_price'
        )

      items = rows.map((r) => ({
        name: r.name,
        imageUrl: r.image_url,
        quantity: Number(r.quantity),
        price: Number(r.base_price) * Number(r.quantity),
      }))
    }

    // Optional: nach Anzeige löschen, damit bei Reload nicht alte Bestellung kommt
    // === Jerome ===
    session.forget('lastOrderIds')

    return view.render('pages/checkout_success', {
      customer,
      items,
      totalSum,
      shippingSum,
    })
  }
}
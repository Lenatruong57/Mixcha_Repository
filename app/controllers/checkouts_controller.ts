import type { HttpContext } from '@adonisjs/core/http'
import db from '@adonisjs/lucid/services/db'
import Customer from '#models/customer'

  // Typdefinition für Warenkorb-Items, so wie sie in der Session gespeichert werden.
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

  // Fixe Versandkosten 
export default class CheckoutsController {
  private shipping = 3.99

  // Berechnet die Zwischensumme aus allen Warenkorbpositionen.
  // Dazu werden pro Item: (unitPrice + engravingPrice) * quantity addiert.  
  private calcSubtotal(cartItems: CartItem[]) {
    return cartItems.reduce((sum, item) => {
      const engrave = item.engravingPrice ? Number(item.engravingPrice) : 0
      return sum + (Number(item.unitPrice) + engrave) * Number(item.quantity)
    }, 0)
  }

  // Rabattlogik anhand eines Coupons.
  // Aktuell: nur "mixcha10" -> 10% Rabatt bei Upload eines Fotos im Blog.
  private calcDiscount(subtotal: number, coupon?: string) {
    if (!coupon) return 0
    if (coupon.toLowerCase() === 'mixcha10') return subtotal * 0.1
    return 0
  }

  // GET /checkout -> Checkout-Seite anzeigen.
  public async index({ view, session }: HttpContext) {
  // Warenkorb und Coupon kommen aus der Session.
  // Session = serverseitiger Speicher pro Nutzer (z.B. Cookie+Session Store).
    const cartItems: CartItem[] = session.get('cart', [])
    const coupon: string | null = session.get('coupon', null)

  // Preisberechnungen für die Checkout-Übersicht.
    const subtotal = this.calcSubtotal(cartItems)
    const discount = this.calcDiscount(subtotal, coupon ?? undefined)
    const shipping = cartItems.length > 0 ? this.shipping : 0
    const total = Math.max(0, subtotal - discount + shipping)

  // Wenn Nutzer eingeloggt ist: customerId liegt in der Session.
  // Dann laden wir den Customer aus der DB.
  // Dadurch sind Felder im Formular vorausgefüllt.   
    let customer: Customer | null = null
    const customerId = session.get('customerId') as number | undefined
    if (customerId) {
      customer = await Customer.find(customerId)
    }

  // Rendern des checkout.edge Templates mit allen Daten.    
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

  // POST /checkout/coupon -> Coupon setzen/prüfen
  public async applyCoupon({ request, session, response }: HttpContext) {
    const code = String(request.input('coupon', '')).trim()

  // Wenn leer -> Coupon entfernen
    if (!code) {
      session.forget('coupon')
      return response.redirect('/checkout')
    }

  // Wenn ungültig -> Flash Message setzen, Coupon entfernen
    if (code.toLowerCase() !== 'mixcha10') {
      session.flash('invalidCoupon', 'Ungültiger Code.')
      session.forget('coupon')
      return response.redirect('/checkout')
    }

  // Gültiger Code -> in Session speichern  
    session.put('coupon', code)
    return response.redirect('/checkout')
  }

  // POST /checkout/process -> Bestellung ausführen (DB schreiben)
  public async process({ request, session, response }: HttpContext) {
  // Warenkorb aus Session lesen. Wenn leer -> zurück zum Warenkorb.
    const cartItems: CartItem[] = session.get('cart', [])
    if (cartItems.length === 0) return response.redirect('/warenkorb')

  // Formulardaten aus checkout.edge.
  // Diese Werte werden später in der customers-Tabelle gespeichert/aktualisiert.
    const email = String(request.input('email') ?? '').trim().toLowerCase()
    const firstName = String(request.input('first_name') ?? '').trim()
    const lastName = String(request.input('last_name') ?? '').trim()
    const street = String(request.input('street') ?? '').trim()
    const houseNumber = String(request.input('house_number') ?? '').trim()
    const postalCode = String(request.input('postal_code') ?? '').trim()
    const city = String(request.input('city') ?? '').trim()

  // Prüfen: gibt es bereits einen eingeloggten Kunden?
  // Wenn ja: customerId liegt in Session.
    let customerId = session.get('customerId') as number | undefined

  // 1) Customer in DB anlegen oder updaten
    if (!customerId) {
  // Gastbestellung: Wir erstellen einen Customer-Eintrag in der DB.
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

  //  Gast "einloggen", damit success() Customer-Daten sicher findet.
      session.put('customerId', customerId)
    } else {
      // Eingeloggt: wir aktualisieren Adresse etc., damit DB und Checkout-Angaben konsistent sind.
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

  // 2) Orders + Order Items in DB anlegen
  // Man speichert Order-IDs, damit success() später weiß, welche Orders "die letzten" waren.
    const createdOrderIds: number[] = []

  // Coupon aus Session lesen (wird in index() gesetzt).
    const coupon: string | null = session.get('coupon', null)

  // Orders + Items anlegen 
    for (let i = 0; i < cartItems.length; i++) {
      const item = cartItems[i]

        // Preislogik auf Positions-Ebene.
      const engrave = item.engravingPrice ? Number(item.engravingPrice) : 0
      const lineSubtotal = (Number(item.unitPrice) + engrave) * Number(item.quantity)

        // Versand & Rabatt nur einmal (beim ersten Item), damit es nicht mehrfach berechnet wird.
      const lineShipping = i === 0 ? this.shipping : 0
      const lineDiscount = i === 0 ? this.calcDiscount(lineSubtotal, coupon ?? undefined) : 0
      const lineTotal = Math.max(0, lineSubtotal - lineDiscount + lineShipping)

        // orders INSERT -> neue Order in DB
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

        // order_items INSERT -> Position zu dieser Order
      await db.table('order_items').insert({
        order_id: safeOrderId,
        product_id: item.productId,
        quantity: item.quantity,
        variant_id: Number(item.variantId ?? 1),
      })
    }

    // 3) Infos für Success-Seite in Session speichern
    // Success-Seite (Preise aus Session/Warenkorb inkl. Extras & Coupon)
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

    // Komplette Daten, die checkout_success.edge benötigt.
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

    // 4) Session leeren (Warenkorb & Coupon).
    session.forget('cart')
    session.forget('coupon')

    return response.redirect('/checkout/success')
  }

  // GET /checkout/success -> Bestellbestätigung anzeigen
  public async success({ view, session }: HttpContext) {
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
      // nach Anzeige löschen, damit Reload nicht wieder alte Bestellung zeigt.
      session.forget('lastCheckoutSummary')

      return view.render('pages/checkout_success', {
        customer: summary.customer,
        items: summary.items,
        totalSum: summary.totalSum,
        shippingSum: summary.shippingSum,
      })
    }

    // Order-IDs aus Session holen und Daten aus DB laden.
    const orderIds = (session.get('lastOrderIds') as number[] | undefined) ?? []
    const customerId = session.get('customerId') as number | undefined

    // Customer Daten aus DB laden
    let customer: any = null
    if (customerId) {
      customer = await db.from('customers').where('id', customerId).first()
    }

    let items: Array<{ name: string; imageUrl: string; quantity: number; price: number }> = []
    let totalSum = 0
    let shippingSum = 0

    if (orderIds.length > 0) {
      // Orders laden -> Summen berechnen
      const orders = await db.from('orders').whereIn('id', orderIds)
      totalSum = orders.reduce((s, o) => s + Number(o.total ?? 0), 0)
      shippingSum = orders.reduce((s, o) => s + Number(o.shipping ?? 0), 0)

      // order_items mit products joinen -> Produktinfos bekommen
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

      // Positionen für Edge vorbereiten
      items = rows.map((r) => ({
        name: r.name,
        imageUrl: r.image_url,
        quantity: Number(r.quantity),
        price: Number(r.base_price) * Number(r.quantity),
      }))
    }

    // nach Anzeige löschen, damit bei Reload nicht alte Bestellung kommt.
    session.forget('lastOrderIds')

    return view.render('pages/checkout_success', {
      customer,
      items,
      totalSum,
      shippingSum,
    })
  }
}
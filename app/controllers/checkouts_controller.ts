import type { HttpContext } from '@adonisjs/core/http'
import db from '@adonisjs/lucid/services/db'

export default class CheckoutsController {
  
  public async index({ view, session }: HttpContext) {
    const cartId = session.get('cart_id')

    let items: any[] = []
    let total = 0

    if (cartId) {
      items = await db
        .from('cart_items')
        .join('products', 'cart_items.product_id', 'products.id')
        .where('cart_items.cart_id', cartId)
        .select(
          'cart_items.id',
          'cart_items.quantity',
          'products.name',
          'products.price'
        )

      total = items.reduce(
        (sum, item) => sum + item.quantity * item.price,
        0
      )
    }

    return view.render('pages/checkout', {
      items,
      total,
    })
  }

  public async process({ request, session, response }: HttpContext) {
    const cartId = session.get('cart_id')
    if (!cartId) {
      return response.redirect('/warenkorb')
    }

    const firstName = request.input('first_name')
    const lastName = request.input('last_name')
    const street = request.input('street')
    const zip = request.input('zip')
    const city = request.input('city')
    const country = request.input('country')

   
    const [customerId] = await db.table('customers').insert({
      first_name: firstName,
      last_name: lastName,
      email: 'kunde@example.com', 
      password: 'dummy',
    })

    await db.table('addresses').insert({
      customer_id: customerId,
      street,
      zip,
      city,
      country,
    })

    const items = await db
      .from('cart_items')
      .where('cart_id', cartId)
      .select('*')

    const [orderId] = await db.table('orders').insert({
      customer_id: customerId,
      created_at: new Date().toISOString(),
      status: 'offen',
    })

    for (const item of items) {
      await db.table('order_items').insert({
        order_id: orderId,
        product_id: item.product_id,
        quantity: item.quantity,
      })
    }

    await db.from('cart_items').where('cart_id', cartId).delete()
    session.forget('cart_id')

    return response.redirect('/checkout/success')
  }

  public async success({ view }: HttpContext) {
    return view.render('pages/checkout_success')
  }
}
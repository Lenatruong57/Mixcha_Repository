import type { HttpContext } from '@adonisjs/core/http'
import db from '@adonisjs/lucid/services/db'

export default class WarenkorbsController {
  // Warenkorb anzeigen
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

    return view.render('pages/warenkorb', {
      items,
      total,
    })
  }

  // Produkt zum Warenkorb hinzufügen
  public async add({ request, session, response }: HttpContext) {
    const productId = request.input('product_id')
    const quantity = Number(request.input('quantity') || 1)

    // 1. Sicherstellen, dass es einen cart gibt
    let cartId = session.get('cart_id')

    if (!cartId) {
      const [id] = await db
        .table('carts')
        .insert({ created_at: new Date().toISOString() })
      cartId = id
      session.put('cart_id', cartId)
    }

    // 2. Prüfen, ob das Produkt schon im Warenkorb ist
    const existing = await db
      .from('cart_items')
      .where({ cart_id: cartId, product_id: productId })
      .first()

    if (existing) {
      await db
        .from('cart_items')
        .where('id', existing.id)
        .update({ quantity: existing.quantity + quantity })
    } else {
      await db.table('cart_items').insert({
        cart_id: cartId,
        product_id: productId,
        quantity,
      })
    }

    return response.redirect('/warenkorb')
  }

  // Menge anpassen
  public async updateQuantity({ request, session, response }: HttpContext) {
    const cartId = session.get('cart_id')
    const itemId = request.input('item_id')
    const quantity = Number(request.input('quantity'))

    if (cartId && itemId) {
      if (quantity <= 0) {
        await db.from('cart_items').where({ id: itemId, cart_id: cartId }).delete()
      } else {
        await db
          .from('cart_items')
          .where({ id: itemId, cart_id: cartId })
          .update({ quantity })
      }
    }

    return response.redirect('/warenkorb')
  }

  // Position aus dem Warenkorb löschen
  public async removeItem({ request, session, response }: HttpContext) {
    const cartId = session.get('cart_id')
    const itemId = request.input('item_id')

    if (cartId && itemId) {
      await db
        .from('cart_items')
        .where({ id: itemId, cart_id: cartId })
        .delete()
    }

    return response.redirect('/warenkorb')
  }
}
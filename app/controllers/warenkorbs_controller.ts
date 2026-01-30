import type { HttpContext } from '@adonisjs/core/http'

type CartItem = {
  key: string
  productId: number
  name: string
  imageUrl: string
  unitPrice: number
  quantity: number

  // optional (für Anzeige)
  extras?: string
  size?: string
  color?: string
  engraving?: string
  engravingPrice?: number
}

export default class WarenkorbsController {
  public async index({ view, session }: HttpContext) {
    const cartItems: CartItem[] = session.get('cart', [])

    const subtotal = cartItems.reduce((sum, item) => {
      const engrave = item.engravingPrice ? item.engravingPrice : 0
      return sum + (item.unitPrice + engrave) * item.quantity
    }, 0)

    return view.render('pages/warenkorb', {
      cartItems,
      subtotal,
    })
  }

  public async add({ request, response, session }: HttpContext) {
    const productId = String(request.input('product_id'))
    const name = String(request.input('name'))
    const imageUrl = String(request.input('image_url'))
    const unitPrice = Number(request.input('unit_price'))
    const quantity = Math.max(1, Number(request.input('quantity') ?? 1))

    // optional
    const extras = request.input('extras') ? String(request.input('extras')) : undefined
    const size = request.input('size') ? String(request.input('size')) : undefined
    const color = request.input('color') ? String(request.input('color')) : undefined

    const engraving = request.input('engraving') ? String(request.input('engraving')) : undefined
    const engravingPrice = request.input('engraving_price')
      ? Number(request.input('engraving_price'))
      : undefined

    // Key: gleiche Kombi = gleicher Warenkorb-Posten
    const key = [
      productId,
      extras ?? '',
      size ?? '',
      color ?? '',
      engraving ?? '',
    ].join('|')

    const cart: CartItem[] = session.get('cart', [])
    const existing = cart.find((i) => i.key === key)

    if (existing) {
      existing.quantity += quantity
    } else {
      cart.push({
        key,
        productId: Number(productId),
        name,
        imageUrl,
        unitPrice,
        quantity,
        extras,
        size,
        color,
        engraving,
        engravingPrice,
      })
    }

    session.put('cart', cart)
    return response.redirect('/warenkorb')
  }

  public async updateQty({ request, response, session }: HttpContext) {
    const key = String(request.input('key'))
    const delta = Number(request.input('delta', 0))
  
    const cart = session.get('cart', []) as any[]
  
    const idx = cart.findIndex((i) => i.key === key)
    if (idx !== -1) {
      cart[idx].quantity = Number(cart[idx].quantity || 1) + delta
  
      // wenn 0 oder kleiner -> löschen
      if (cart[idx].quantity <= 0) {
        cart.splice(idx, 1)
      }
    }
  
    session.put('cart', cart)
    return response.redirect().back()
  }

  public async remove({ request, response, session }: HttpContext) {
    const key = String(request.input('key'))
    const cart: CartItem[] = session.get('cart', [])
    session.put('cart', cart.filter((i) => i.key !== key))
    return response.redirect('/warenkorb')
  }
}
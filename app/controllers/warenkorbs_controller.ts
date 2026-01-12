import type { HttpContext } from '@adonisjs/core/http'

type CartItem = {
  key: string
  productId: number
  name: string
  imageUrl: string
  variantLabel: string // z.B. "Vanille • 30gr" oder "Beige • Gravur: Nein"
  unitPrice: number
  quantity: number
}

export default class WarenkorbsController {
  public async index({ view, session }: HttpContext) {
    const cart: CartItem[] = session.get('cart', [])
    const subtotal = cart.reduce((sum, item) => sum + item.unitPrice * item.quantity, 0)

    return view.render('pages/warenkorb', {
      cartItems: cart,
      subtotal,
    })
  }

  public async add({ request, response, session }: HttpContext) {
    const productId = Number(request.input('product_id'))
    const name = String(request.input('name') || '')
    const imageUrl = String(request.input('image_url') || '')
    const unitPrice = Number(request.input('unit_price'))

    // Varianten (je nach Produktseite)
    const extras = request.input('extras') ? String(request.input('extras')) : null
    const size = request.input('size') ? String(request.input('size')) : null

    const color = request.input('color') ? String(request.input('color')) : null
    const engraving = request.input('engraving') ? String(request.input('engraving')) : null
    const engravingText = request.input('engraving_text') ? String(request.input('engraving_text')) : null

    if (!productId || !name || !imageUrl || !unitPrice || Number.isNaN(unitPrice)) {
      return response.redirect().back()
    }

    // label für Warenkorb
    let variantParts: string[] = []
    if (extras) variantParts.push(extras)
    if (size) variantParts.push(size)

    if (color) variantParts.push(color)
    if (engraving) {
      if (engraving === 'Ja' && engravingText) variantParts.push(`Gravur: ${engravingText}`)
      else variantParts.push('Gravur: Nein')
    }

    const variantLabel = variantParts.join(' • ') || 'Standard'
    const key = `${productId}|${variantLabel}|${unitPrice}`

    const cart: CartItem[] = session.get('cart', [])
    const existing = cart.find((i) => i.key === key)

    if (existing) existing.quantity += 1
    else {
      cart.push({
        key,
        productId,
        name,
        imageUrl,
        variantLabel,
        unitPrice,
        quantity: 1,
      })
    }

    session.put('cart', cart)
    return response.redirect('/warenkorb')
  }

  public async remove({ request, response, session }: HttpContext) {
    const key = String(request.input('key') || '')
    const cart: CartItem[] = session.get('cart', [])
    session.put('cart', cart.filter((i) => i.key !== key))
    return response.redirect('/warenkorb')
  }

  public async update({ request, response, session }: HttpContext) {
    const key = String(request.input('key') || '')
    const qty = Math.max(1, Number(request.input('quantity') || 1))

    const cart: CartItem[] = session.get('cart', [])
    const item = cart.find((i) => i.key === key)
    if (item) item.quantity = qty

    session.put('cart', cart)
    return response.redirect('/warenkorb')
  }
}
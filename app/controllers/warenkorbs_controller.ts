import type { HttpContext } from '@adonisjs/core/http'

type CartItem = {
  key: string
  productId: number
  name: string
  imageUrl: string
  extras: string
  size: string
  unitPrice: number
  quantity: number
}

export default class WarenkorbsController {
  // =========================
  // GET /warenkorb
  // =========================
  public async index({ view, session }: HttpContext) {
    const cart: CartItem[] = session.get('cart', [])

    const subtotal = cart.reduce((sum, item) => {
      return sum + item.unitPrice * item.quantity
    }, 0)

    return view.render('pages/warenkorb', {
      cart,
      subtotal,
    })
  }

  // =========================
  // POST /warenkorb/add
  // =========================
  public async add({ request, response, session }: HttpContext) {
    const productId = Number(request.input('product_id'))
    const name = String(request.input('name'))
    const imageUrl = String(request.input('image_url'))
    const extras = String(request.input('extras') ?? 'vanille')
    const size = String(request.input('size') ?? '30')
    const unitPrice = Number(request.input('unit_price'))

    // ❗ Sicherheitscheck (wichtig gegen 500 Errors)
    if (!productId || !name || !imageUrl || !unitPrice || Number.isNaN(unitPrice)) {
      return response.redirect('/produkte')
    }

    const key = `${productId}-${extras}-${size}`

    const cart: CartItem[] = session.get('cart', [])

    const existingItem = cart.find((item) => item.key === key)

    if (existingItem) {
      existingItem.quantity += 1
    } else {
      cart.push({
        key,
        productId,
        name,
        imageUrl,
        extras,
        size,
        unitPrice,
        quantity: 1,
      })
    }

    session.put('cart', cart)

    return response.redirect('/warenkorb')
  }

  // =========================
  // POST /warenkorb/update-quantity
  // =========================
  public async updateQuantity({ request, response, session }: HttpContext) {
    const key = String(request.input('key'))
    const quantity = Math.max(1, Number(request.input('quantity') ?? 1))

    const cart: CartItem[] = session.get('cart', [])

    const item = cart.find((i) => i.key === key)
    if (item) {
      item.quantity = quantity
    }

    session.put('cart', cart)
    return response.redirect('/warenkorb')
  }

  // =========================
  // POST /warenkorb/remove-item
  // =========================
  public async removeItem({ request, response, session }: HttpContext) {
    const key = String(request.input('key'))

    const cart: CartItem[] = session.get('cart', [])
    const filtered = cart.filter((item) => item.key !== key)

    session.put('cart', filtered)
    return response.redirect('/warenkorb')
  }
}
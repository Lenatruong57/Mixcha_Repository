import type { HttpContext } from '@adonisjs/core/http'

export default class CartCountMiddleware {
  async handle(ctx: HttpContext, next: () => Promise<void>) {
    const cart = (ctx.session.get('cart') || []) as Array<{ quantity?: number }>

    const cartCount = cart.reduce((sum, item) => sum + Number(item.quantity ?? 1), 0)

    ctx.view.share({ cartCount })

    await next()
  }
}
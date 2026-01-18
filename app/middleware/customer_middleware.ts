import type { HttpContext } from '@adonisjs/core/http'

export default class CustomerMiddleware {
  public async handle({ session, response }: HttpContext, next: () => Promise<void>) {
    const customerId = session.get('customerId')

    if (!customerId) {
      return response.redirect('/login')
    }

    await next()
  }
}
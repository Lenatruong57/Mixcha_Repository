import type { HttpContext } from '@adonisjs/core/http'

export default class CustomerMiddleware {
  public async handle({ session, response }: HttpContext, next: () => Promise<void>) {
    // WICHTIG: verhindert Back-Button Cache
    response.header('Cache-Control', 'no-store, no-cache, must-revalidate, private, max-age=0')
    response.header('Pragma', 'no-cache')
    response.header('Expires', '0')

    const customerId = session.get('customer_id')
    if (!customerId) {
      return response.redirect('/login')
    }

    await next()
  }
}
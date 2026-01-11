import type { HttpContext } from '@adonisjs/core/http'

export default class AdminMiddleware {
  public async handle({ session, response }: HttpContext, next: () => Promise<void>) {
    const adminId = session.get('adminId')

    if (!adminId) {
      return response.redirect('/haendler-login')
    }

    await next()
  }
}

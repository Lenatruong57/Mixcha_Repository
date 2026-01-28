import type { HttpContext } from '@adonisjs/core/http'


export default class HomeController {
  public async index({ view }: HttpContext) {
    // 3 Produkte aus der Datenbank holen (z. B. die neuesten)
 
    return view.render('pages/home')
  }
}
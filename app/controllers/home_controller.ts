import type { HttpContext } from '@adonisjs/core/http'

export default class HomeController {
<<<<<<< HEAD
    public async index({ view }: HttpContext) {
        return view.render('pages/home')
    }     
=======
  public async index({ view }: HttpContext) {
    return view.render('pages/home')   // dein Edge-Template
  }
>>>>>>> 98e83aa35cad394195e31b358afe6de7c59706b2
}
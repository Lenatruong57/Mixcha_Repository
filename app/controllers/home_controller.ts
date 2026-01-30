import type { HttpContext } from '@adonisjs/core/http'
import Product from '#models/product'

export default class HomeController {
 // GET / → Startseite anzeigen
  public async index({ view }: HttpContext) {
 // Produkte aus der Datenbank laden (- Sortierung nach ID aufsteigend):
 // Limit auf 3 Produkte (Bestseller auf der Startseite)
    const products = await Product.query().orderBy('id', 'asc').limit(3)
    // Übergabe der Produkte an das home.edge Template
    return view.render('pages/home', { products })
  }
}
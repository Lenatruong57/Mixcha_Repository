import type { HttpContext } from '@adonisjs/core/http'
import Product from '#models/product'

export default class AdminController {
  // GET /admin -> Liste
  public async index({ view }: HttpContext) {
    const products = await Product.all()
    return view.render('pages/admin', { products }) 
  }

  // GET /admin/produkte/new -> Formular "neu"
  public async new({ view }: HttpContext) {
    return view.render('pages/admin_new')
  }

  // POST /admin/produkte -> Speichern (neu)
  public async store({ request, response, session }: HttpContext) {
    const data = request.only(['name', 'description', 'base_price', 'image_url', 'category_id'])

    const basePrice = Number(data.base_price)
    const categoryId = Number(data.category_id)

    // Minimal-Validierung
    if (!data.name || Number.isNaN(basePrice) || Number.isNaN(categoryId)) {
      session.flash('error', 'Bitte Name, Basispreis und Kategorie korrekt ausfüllen.')
      return response.redirect().back()
    }

    await Product.create({
      name: data.name,
      description: data.description ?? null,
      basePrice,
      imageUrl: data.image_url ?? null,
      categoryId,
    })

    session.flash('success', 'Produkt wurde angelegt.')
    return response.redirect('/admin')
  }

  // GET /admin/produkte/:id/edit -> Formular "bearbeiten"
  public async edit({ params, view, response, session }: HttpContext) {
    const product = await Product.find(params.id)

    if (!product) {
      session.flash('error', 'Produkt nicht gefunden.')
      return response.redirect('/admin')
    }

    return view.render('pages/admin_edit', { product })
  }

  // POST /admin/produkte/:id -> Speichern (edit)
  public async update({ params, request, response, session }: HttpContext) {
    const product = await Product.find(params.id)

    if (!product) {
      session.flash('error', 'Produkt nicht gefunden.')
      return response.redirect('/admin')
    }

    const data = request.only(['name', 'description', 'base_price', 'image_url', 'category_id'])

    const basePrice = Number(data.base_price)
    const categoryId = Number(data.category_id)

    if (!data.name || Number.isNaN(basePrice) || Number.isNaN(categoryId)) {
      session.flash('error', 'Bitte Name, Basispreis und Kategorie korrekt ausfüllen.')
      return response.redirect().back()
    }

    product.name = data.name
    product.description = data.description ?? null
    product.basePrice = basePrice
    product.imageUrl = data.image_url ?? null
    product.categoryId = categoryId

    await product.save()

    session.flash('success', 'Produkt wurde gespeichert.')
    return response.redirect('/admin')
  }

  // POST /admin/produkte/:id/delete -> Löschen
  public async destroy({ params, response, session }: HttpContext) {
    const product = await Product.find(params.id)

    if (!product) {
      session.flash('error', 'Produkt nicht gefunden.')
      return response.redirect('/admin')
    }

    await product.delete()
    session.flash('success', 'Produkt wurde gelöscht.')
    return response.redirect('/admin')
  }
}
    
import type { HttpContext } from '@adonisjs/core/http'
import Product from '#models/product'

export default class AdminController {
  // GET /admin  -> Liste
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
    const data = request.only([
      'name',
      'description',
      'base_price',
      'image_url',
      'category_id',
    ])

    // Minimal-Validierung 
    if (!data.name || !data.base_price || !data.category_id) {
      session.flash('error', 'Bitte Name, Basispreis und Kategorie ausfüllen.')
      return response.redirect().back()
    }

    await Product.create({
      name: data.name,
      description: data.description ?? null,
      basePrice: Number(data.base_price),
      imageUrl: data.image_url ?? null,
      categoryId: Number(data.category_id),
    })

    session.flash('success', 'Produkt wurde angelegt.')
    return response.redirect('/admin')
  }

  // GET /admin/produkte/:id/edit -> Formular "bearbeiten"
  public async edit({ params, view, response }: HttpContext) {
    const product = await Product.find(params.id)

    if (!product) {
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

    const data = request.only([
      'name',
      'description',
      'base_price',
      'image_url',
      'category_id',
    ])

    if (!data.name || !data.base_price || !data.category_id) {
      session.flash('error', 'Bitte Name, Basispreis und Kategorie ausfüllen.')
      return response.redirect().back()
    }

    product.name = data.name
    product.description = data.description ?? null
    product.basePrice = Number(data.base_price)
    product.imageUrl = data.image_url ?? null
    product.categoryId = Number(data.category_id)

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


    
import type { HttpContext } from '@adonisjs/core/http'
import Product from '#models/product'
import ProductVariant from '#models/product_variant'

export default class AdminController {
  // GET /admin -> Liste
  public async index({ view }: HttpContext) {
    const products = await Product.query().orderBy('id', 'asc')
    return view.render('pages/admin', { products })
  }

  // GET /admin/produkte/new -> Formular "neu"
  public async new({ view }: HttpContext) {
    return view.render('pages/admin_new')
  }

  // Hilfsfunktion: Varianten sauber aus Request holen & validieren
  // akzeptiert {name, price} ODER {size, price} und mappt immer auf size
  private cleanVariants(input: any): Array<{ size: string; price: number }> {
    const variants =
      (input ?? []) as Array<{ name?: string; size?: string; price?: string | number }>

    return variants
      .map((v) => ({
        size: ((v?.size ?? v?.name) ?? '').trim(),
        price: Number(v?.price),
      }))
      .filter((v) => v.size && Number.isFinite(v.price))
  }

  // POST /admin/produkte -> Speichern (neu)
  public async store({ request, response, session }: HttpContext) {
    const data = request.only(['name', 'description', 'base_price', 'image_url', 'category_id'])

    const name = (data.name ?? '').trim()
    const description = (data.description ?? '').trim() || null
    const imageUrl = (data.image_url ?? '').trim() || null

    const categoryId = Number(data.category_id)

    // base_price OPTIONAL: leer -> 0
    const basePriceRaw = data.base_price
    const basePrice =
      basePriceRaw === '' || basePriceRaw === null || basePriceRaw === undefined ? 0 : Number(basePriceRaw)

    if (!name || Number.isNaN(categoryId) || Number.isNaN(basePrice)) {
      session.flash('error', 'Bitte Name, Kategorie und Basispreis korrekt ausfüllen.')
      return response.redirect().back()
    }

    // Varianten kommen als variants[0][name]/[price] (oder später variants[0][size])
    const cleanVariants = this.cleanVariants(request.input('variants'))

    if (cleanVariants.length !== 3) {
      session.flash('error', 'Bitte genau 3 Varianten angeben (Größe + Preis).')
      return response.redirect().back()
    }

    // Produkt erstellen
    const product = await Product.create({
      name,
      description,
      basePrice,
      imageUrl,
      categoryId,
    })

    // Varianten speichern (DB hat "size", nicht "name")
    await ProductVariant.createMany([
      { productId: product.id, size: cleanVariants[0].size, price: cleanVariants[0].price },
      { productId: product.id, size: cleanVariants[1].size, price: cleanVariants[1].price },
      { productId: product.id, size: cleanVariants[2].size, price: cleanVariants[2].price },
    ])

    session.flash('success', 'Produkt wurde angelegt (inkl. 3 Varianten).')
    return response.redirect('/admin')
  }

  // GET /admin/produkte/:id/edit -> Formular "bearbeiten"
  public async edit({ params, view, response, session }: HttpContext) {
    const product = await Product.query()
      .where('id', params.id)
      .preload('variants', (q) => q.orderBy('id', 'asc'))
      .first()

    if (!product) {
      session.flash('error', 'Produkt nicht gefunden.')
      return response.redirect('/admin')
    }

    return view.render('pages/admin_edit', { product })
  }

  // POST /admin/produkte/:id -> Speichern (edit)
  public async update({ params, request, response, session }: HttpContext) {
    const product = await Product.query()
      .where('id', params.id)
      .preload('variants', (q) => q.orderBy('id', 'asc'))
      .first()

    if (!product) {
      session.flash('error', 'Produkt nicht gefunden.')
      return response.redirect('/admin')
    }

    const data = request.only(['name', 'description', 'base_price', 'image_url', 'category_id'])

    const name = (data.name ?? '').trim()
    const description = (data.description ?? '').trim() || null
    const imageUrl = (data.image_url ?? '').trim() || null

    const categoryId = Number(data.category_id)

    // base_price OPTIONAL: leer -> 0
    const basePriceRaw = data.base_price
    const basePrice =
      basePriceRaw === '' || basePriceRaw === null || basePriceRaw === undefined ? 0 : Number(basePriceRaw)

    if (!name || Number.isNaN(categoryId) || Number.isNaN(basePrice)) {
      session.flash('error', 'Bitte Name, Kategorie und Basispreis korrekt ausfüllen.')
      return response.redirect().back()
    }

    const cleanVariants = this.cleanVariants(request.input('variants'))

    if (cleanVariants.length !== 3) {
      session.flash('error', 'Bitte genau 3 Varianten angeben (Größe + Preis).')
      return response.redirect().back()
    }

    // Produkt updaten
    product.name = name
    product.description = description
    product.basePrice = basePrice
    product.imageUrl = imageUrl
    product.categoryId = categoryId
    await product.save()

    // Varianten: alte löschen, neue anlegen
    await product.related('variants').query().delete()

    await ProductVariant.createMany([
      { productId: product.id, size: cleanVariants[0].size, price: cleanVariants[0].price },
      { productId: product.id, size: cleanVariants[1].size, price: cleanVariants[1].price },
      { productId: product.id, size: cleanVariants[2].size, price: cleanVariants[2].price },
    ])

    session.flash('success', 'Produkt wurde gespeichert (inkl. 3 Varianten).')
    return response.redirect('/admin')
  }

  // POST /admin/produkte/:id/delete -> Löschen
  public async destroy({ params, response, session }: HttpContext) {
    const product = await Product.find(params.id)

    if (!product) {
      session.flash('error', 'Produkt nicht gefunden.')
      return response.redirect('/admin')
    }

    await product.related('variants').query().delete()
    await product.delete()

    session.flash('success', 'Produkt wurde gelöscht.')
    return response.redirect('/admin')
  }
}
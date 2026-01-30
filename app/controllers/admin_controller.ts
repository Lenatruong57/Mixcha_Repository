import type { HttpContext } from '@adonisjs/core/http'
import Product from '#models/product'
import ProductVariant from '#models/product_variant'
import ProductExtra from '#models/product_extra'

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
  private cleanExtras(input: any): Array<{ name: string }> {
    const extras = (input ?? []) as Array<{ name?: string }>
    return extras
      .map((e) => ({ name: (e?.name ?? '').trim() }))
      .filter((e) => e.name.length > 0)
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

    // 3 Varianten Pflicht (Premium/Ceremonial)
    const cleanVariants = this.cleanVariants(request.input('variants'))
    if (cleanVariants.length !== 3) {
      session.flash('error', 'Bitte genau 3 Varianten angeben (Größe + Preis).')
      return response.redirect().back()
    }

    // 4 Extras Pflicht (ohne Aufpreis)
    const cleanExtras = this.cleanExtras(request.input('extras'))
    if (cleanExtras.length !== 4) {
      session.flash('error', 'Bitte genau 4 Extras angeben (nur Name).')
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

    // Varianten speichern
    await ProductVariant.createMany([
      { productId: product.id, size: cleanVariants[0].size, price: cleanVariants[0].price },
      { productId: product.id, size: cleanVariants[1].size, price: cleanVariants[1].price },
      { productId: product.id, size: cleanVariants[2].size, price: cleanVariants[2].price },
    ])

    // Extras speichern (ohne Aufpreis)
    await ProductExtra.createMany([
      { productId: product.id, name: cleanExtras[0].name, priceDelta: 0, requiresText: false, textLabel: null },
      { productId: product.id, name: cleanExtras[1].name, priceDelta: 0, requiresText: false, textLabel: null },
      { productId: product.id, name: cleanExtras[2].name, priceDelta: 0, requiresText: false, textLabel: null },
      { productId: product.id, name: cleanExtras[3].name, priceDelta: 0, requiresText: false, textLabel: null },
    ])

    session.flash('success', 'Produkt wurde angelegt (3 Varianten + 4 Extras).')
    return response.redirect('/admin')
  }

  // GET /admin/produkte/:id/edit -> Formular "bearbeiten"
  public async edit({ params, view, response, session }: HttpContext) {
    const product = await Product.query()
      .where('id', params.id)
      .preload('variants', (q) => q.orderBy('id', 'asc'))
      .preload('extras', (q) => q.orderBy('id', 'asc'))
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
      .preload('extras', (q) => q.orderBy('id', 'asc'))
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

    const cleanExtras = this.cleanExtras(request.input('extras'))
    if (cleanExtras.length !== 4) {
      session.flash('error', 'Bitte genau 4 Extras angeben (nur Name).')
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

    // Extras: alte löschen, neue anlegen (ohne Aufpreis)
    await product.related('extras').query().delete()
    await ProductExtra.createMany([
      { productId: product.id, name: cleanExtras[0].name, priceDelta: 0, requiresText: false, textLabel: null },
      { productId: product.id, name: cleanExtras[1].name, priceDelta: 0, requiresText: false, textLabel: null },
      { productId: product.id, name: cleanExtras[2].name, priceDelta: 0, requiresText: false, textLabel: null },
      { productId: product.id, name: cleanExtras[3].name, priceDelta: 0, requiresText: false, textLabel: null },
    ])

    session.flash('success', 'Produkt wurde gespeichert (3 Varianten + 4 Extras).')
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
    await product.related('extras').query().delete()
    await product.delete()

    session.flash('success', 'Produkt wurde gelöscht.')
    return response.redirect('/admin')
  }
}
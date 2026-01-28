import ProductVariant from '#models/product_variant'

export default class ProductVariantSeeder {
  public async run() {
    await ProductVariant.updateOrCreateMany('id', [
      // Premium (product_id = 1)
      { id: 1, productId: 1, name: '30g', grams: 30, price: 19.9 },
      { id: 2, productId: 1, name: '70g', grams: 70, price: 39.9 },
      { id: 3, productId: 1, name: '100g', grams: 100, price: 59.9 },

      // Ceremonial (product_id = 2)
      { id: 4, productId: 2, name: '30g', grams: 30, price: 25.9 },
      { id: 5, productId: 2, name: '70g', grams: 70, price: 45.9 },
      { id: 6, productId: 2, name: '100g', grams: 100, price: 60.9 },

      // Set (product_id = 3) -> keine Varianten
    ])
  }
}
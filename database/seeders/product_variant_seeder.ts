import ProductVariant from '#models/product_variant'

export default class ProductVariantSeeder {
  public async run () {
    await ProductVariant.createMany([
      // Produkt 1: Premium
      { productId: 1, size: '30g', price: 19.9 },
      { productId: 1, size: '70g', price: 39.9 },
      { productId: 1, size: '100g', price: 59.9 },

      // Produkt 2: Ceremonial
      { productId: 2, size: '30g', price: 25.9 },
      { productId: 2, size: '70g', price: 45.9 },
      { productId: 2, size: '100g', price: 60.9 },
    ])
  }
}
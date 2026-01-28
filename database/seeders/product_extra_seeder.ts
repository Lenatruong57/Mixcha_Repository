import ProductExtra from '#models/product_extra'

export default class ProductExtraSeeder {
  public async run() {
    await ProductExtra.updateOrCreateMany('id', [
      // Premium (product_id = 1)
      { id: 1, productId: 1, name: 'Vanille', priceDelta: 2.0, requiresText: false, textLabel: null },
      { id: 2, productId: 1, name: 'Kokos', priceDelta: 2.0, requiresText: false, textLabel: null },
      { id: 3, productId: 1, name: 'Zimt', priceDelta: 2.0, requiresText: false, textLabel: null },
      { id: 4, productId: 1, name: 'Veganes Kollagenpulver', priceDelta: 5.0, requiresText: false, textLabel: null },

      // Ceremonial (product_id = 2)
      { id: 5, productId: 2, name: 'Vanille', priceDelta: 2.0, requiresText: false, textLabel: null },
      { id: 6, productId: 2, name: 'Kokos', priceDelta: 2.0, requiresText: false, textLabel: null },
      { id: 7, productId: 2, name: 'Zimt', priceDelta: 2.0, requiresText: false, textLabel: null },
      { id: 8, productId: 2, name: 'Veganes Kollagenpulver', priceDelta: 5.0, requiresText: false, textLabel: null },

      // Set (product_id = 3) -> Gravur (Text nötig)
      {
        id: 9,
        productId: 3,
        name: 'Gravur',
        priceDelta: 5.0,
        requiresText: true,
        textLabel: 'Was soll eingraviert werden?',
      },
    ])
  }
}
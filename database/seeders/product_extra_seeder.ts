import ProductExtra from '#models/product_extra'

export default class ProductExtraSeeder {
  public async run () {
    await ProductExtra.createMany([
      // =====================
      // Produkt 1 (Premium): alle 0€ Aufpreis
      // =====================
      { productId: 1, name: 'Vanille', priceDelta: 0, requiresText: false, textLabel: null },
      { productId: 1, name: 'Kokos', priceDelta: 0, requiresText: false, textLabel: null },
      { productId: 1, name: 'Zimt', priceDelta: 0, requiresText: false, textLabel: null },
      { productId: 1, name: 'Veganes Kollagenpulver', priceDelta: 0, requiresText: false, textLabel: null },

      // =====================
      // Produkt 2 (Ceremonial): alle 0€ Aufpreis
      // =====================
      { productId: 2, name: 'Vanille', priceDelta: 0, requiresText: false, textLabel: null },
      { productId: 2, name: 'Kokos', priceDelta: 0, requiresText: false, textLabel: null },
      { productId: 2, name: 'Zimt', priceDelta: 0, requiresText: false, textLabel: null },
      { productId: 2, name: 'Veganes Kollagenpulver', priceDelta: 0, requiresText: false, textLabel: null },

      // =====================
      // Produkt 3 (Matcha Set):
      // Farben 0€ + Gravur +5€ mit Textfeld
      // =====================
      { productId: 3, name: 'Beige', priceDelta: 0, requiresText: false, textLabel: null },
      { productId: 3, name: 'Grün',  priceDelta: 0, requiresText: false, textLabel: null },
      { productId: 3, name: 'Blau',  priceDelta: 0, requiresText: false, textLabel: null },
      { productId: 3, name: 'Rosa',  priceDelta: 0, requiresText: false, textLabel: null },

      { productId: 3, name: 'Gravur', priceDelta: 5, requiresText: true, textLabel: 'Gravurtext' },
    ])
  }
}
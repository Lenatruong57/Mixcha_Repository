import Product from '#models/product'

export default class ProductSeeder {
  public async run() {
    await Product.updateOrCreateMany('id', [
      {
        id: 1,
        name: 'Mix your Premium Matcha',
        basePrice: 19.9,
        imageUrl: '/images/MixchaPremium.png',
        description: 'Premium Matcha mit Extras',
      },
      {
        id: 2,
        name: 'Mix your Ceremonial Matcha',
        basePrice: 25.9,
        imageUrl: '/images/MixchaCeremonial.png',
        description: 'Ceremonial Grade Matcha',
      },
      {
        id: 3,
        name: 'Matcha Traditional Set',
        basePrice: 39.9,
        imageUrl: '/images/MatchaSetBeige.png',
        description: 'Set mit Chawan, Chasen etc.',
      },
    ])
  }
}
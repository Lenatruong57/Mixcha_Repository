import type { HttpContext } from '@adonisjs/core/http'

export default class BlogController {

  private posts = [
    {
      id: 1,
      title: 'Matcha Basics',
      teaser: 'Was ist Matcha eigentlich?',
      image: '/images/matcha.jpg',
      sections: [
        {
          heading: 'Was ist Matcha eigentlich?',
          text:
            'Matcha ist ein fein gemahlenes Grünteepulver aus Japan und gilt als eine der edelsten Formen des Teegenusses.\nIm Gegensatz zu klassischem Grüntee wird beim Matcha das gesamte Teeblatt konsumiert – und damit auch all seine wertvollen Inhaltsstoffe.'
        },
        {
          heading: 'Premium vs. Ceremonial Grade – wo liegt der Unterschied?',
          text:
            'Nicht jeder Matcha ist gleich.\nCeremonial Grade Matcha stammt aus den jüngsten, zartesten Blättern der ersten Ernte.\nPremium Matcha eignet sich besonders gut für Matcha Latte, Smoothies oder Rezepte.'
        },
        {
          heading: 'Die Wirkung von Matcha: ruhig wach statt nervös',
          text:
            'Matcha enthält Koffein – jedoch wirkt es anders als Kaffee.\nDas Ergebnis:\nlanganhaltende, klare Energie\ngesteigerte Konzentration\nkein Zittern, kein „Crash“'
        },
        {
          heading: 'Antioxidantien & Nährstoffe',
          text:
            'Matcha ist reich an Catechinen, insbesondere EGCG.\nZusätzlich enthält Matcha:\nChlorophyll\nVitamine (A, C, E)\nMineralstoffe wie Eisen & Magnesium'
        },
        {
          heading: 'Matcha mit natürlichen Extras',
          text:
            'Unsere Matcha-Sorten verbinden höchste Qualität mit modernen Bedürfnissen:\nVanille, Kokos oder Zimt direkt im Pulver\nVeganes Kollagenpulver (optional)\nVerschiedene Größen (30g, 70g, 100g)'
        },
        {
          heading: 'Nachhaltigkeit & Herkunft',
          text:
            'Hochwertiger Matcha steht für Sorgfalt, Handarbeit und Respekt.\nDenn guter Matcha schmeckt nicht nur besser – er fühlt sich auch besser an.'
        },
      ],
    },
    {
      id: 2,
      title: 'Rezepte',
      teaser: 'Latte, Iced Matcha & mehr',
      image: '/images/MatchaSet.png',
      sections: [
        {
          heading: 'Rezepte',
          text: 'Hier kommen bald leckere Matcha-Rezepte wie Matcha Latte, Iced Matcha und Smoothies.',
        },
      ],
    },
    {
  id: 3,
  title: 'Matcha Zubereitung',
  teaser: 'So gelingt dir dein Matcha definitiv!',
  image: '/images/blog 1.png',
  sections: [
    {
      heading: 'Matcha Zubereitung',
      text: 'Hier kommt bald der Inhalt zur perfekten Zubereitung.',
    },
  ],
},

  ]

  public async index({ view }: HttpContext) {
    return view.render('pages/blog', {
      posts: this.posts,
    })
  }

  public async show({ params, view }: HttpContext) {
    const id = Number(params.id)

    const post = this.posts.find((p) => p.id === id)

    if (!post) {
     
      return view.render('pages/blog', { posts: this.posts })
    }

    return view.render('pages/blog_detail', {
      post,
    })
  }
}

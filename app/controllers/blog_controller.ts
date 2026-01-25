// app/controllers/blog_controller.ts
import type { HttpContext } from '@adonisjs/core/http'
import app from '@adonisjs/core/services/app'

// ✅ Jerome: Rezepte-Vorschau im Blog (eigene Seite später über /rezepte)
import RezepteController from '#controllers/rezepte_controller'
const rezepte = new RezepteController()

export default class BlogController {
  private posts = [
    {
      id: 1,
      title: 'Matcha Basics',
      teaser: 'Was ist Matcha eigentlich?',
      image: '/images/coconutmatcha.png',
      sections: [
        {
          heading: 'Was ist Matcha eigentlich?',
          text:
            'Matcha ist ein fein gemahlenes Grünteepulver aus Japan und gilt als eine der edelsten Formen des Teegenusses.\nIm Gegensatz zu klassischem Grüntee wird beim Matcha das gesamte Teeblatt konsumiert – und damit auch all seine wertvollen Inhaltsstoffe.',
        },
        {
          heading: 'Premium vs. Ceremonial Grade – wo liegt der Unterschied?',
          text:
            'Nicht jeder Matcha ist gleich.\nCeremonial Grade Matcha stammt aus den jüngsten, zartesten Blättern der ersten Ernte.\nPremium Matcha eignet sich besonders gut für Matcha Latte, Smoothies oder Rezepte.',
        },
        {
          heading: 'Die Wirkung von Matcha: ruhig wach statt nervös',
          text:
            'Matcha enthält Koffein – jedoch wirkt es anders als Kaffee.\nDas Ergebnis:\nlanganhaltende, klare Energie\ngesteigerte Konzentration\nkein Zittern, kein „Crash“',
        },
        {
          heading: 'Antioxidantien & Nährstoffe',
          text:
            'Matcha ist reich an Catechinen, insbesondere EGCG.\nZusätzlich enthält Matcha:\nChlorophyll\nVitamine (A, C, E)\nMineralstoffe wie Eisen & Magnesium',
        },
        {
          heading: 'Matcha mit natürlichen Extras',
          text:
            'Unsere Matcha-Sorten verbinden höchste Qualität mit modernen Bedürfnissen:\nVanille, Kokos oder Zimt direkt im Pulver\nVeganes Kollagenpulver (optional)\nVerschiedene Größen (30g, 70g, 100g)',
        },
        {
          heading: 'Nachhaltigkeit & Herkunft',
          text:
            'Hochwertiger Matcha steht für Sorgfalt, Handarbeit und Respekt.\nDenn guter Matcha schmeckt nicht nur besser – er fühlt sich auch besser an.',
        },
      ],
    },
    {
      id: 2,
      title: 'Matcha Zubereitung',
      teaser: 'So gelingt dir dein Matcha zu 100%!',
      image: '/images/matchaschalechasen.png',
      sections: [
        {
          heading: 'Der Weg zum perfekten Matcha',
          text:
            'Matcha ist mehr als nur grüner Tee – er ist ein Ritual. Mit der richtigen Zubereitung entfaltet sich sein volles Aroma.',
        },
        {
          heading: 'Warum die richtige Zubereitung so wichtig ist',
          text:
            'Falsche Wassertemperatur oder unzureichendes Aufschlagen können den Geschmack bitter machen.',
        },
        {
          heading: 'Schritt-für-Schritt',
          text:
            'Wasser auf 70–80°C erhitzen, Matcha sieben, mit Chasen schaumig schlagen.',
        },
      ],
    },
    {
      id: 3,
      title: 'Rezepte',
      teaser: 'Unsere liebsten Matcha-Rezepte!',
      image: '/images/cheesecakematcha.png',
      link: '/rezepte',
    },
  ];

  // BLOG STARTSEITE
  public async index({ view }: HttpContext) {
    return view.render('pages/blog', {
      posts: this.posts,

      // ✅ Jerome: Rezepte sollen im Blog rechts als Vorschau sichtbar sein
      // (die echte Rezepte-Seite kommt über /rezepte)
      recipes: rezepte.getPreview(),
    })
  }

  // BLOG DETAILSEITE
  public async show({ params, view, response }: HttpContext) {
    const id = Number(params.id)
    const post = this.posts.find((p) => p.id === id)

    if (!post) {
      return response.redirect('/blog')
    }

    return view.render('pages/blog_detail', {
      post,
    })
  }

  // COMMUNITY FOTO UPLOAD (bleibt!)
  public async upload({ request, response, session }: HttpContext) {
    const image = request.file('image', {
      size: '10mb',
      extnames: ['jpg', 'jpeg', 'png', 'webp'],
    })

    // ✅ sauber: kein Bild ausgewählt
    if (!image) {
      session.flash('uploadError', 'Bitte wähle ein Bild aus.')
      await session.commit()
      return response.redirect().back()
    }

    // ✅ sauber: Bild gewählt, aber ungültig (Endung/Größe/etc.)
    if (!image.isValid) {
      session.flash('uploadError', 'Ungültige Datei. Bitte JPG/PNG/WEBP verwenden (max. 10MB).')
      await session.commit()
      return response.redirect().back()
    }

    const fileName = `${Date.now()}_${image.clientName.replace(/\s+/g, '_')}`

    await image.move(app.publicPath('avatars'), {
      name: fileName,
    })

    session.flash(
      'uploadSuccess',
      'Wir freuen uns sehr über das Foto. Spare bei deiner nächsten Bestellung 10% mit dem Code "mixcha10"!'
    )

    await session.commit()
    return response.redirect().back()
  }
}
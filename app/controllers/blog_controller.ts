import type { HttpContext } from '@adonisjs/core/http'
import app from '@adonisjs/core/services/app'

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
            'Unsere Matcha-Sorten verbinden höchste Qualität mit modernen Bedürfnissen:\n - Vanille, Kokos oder Zimt direkt im Pulver\n - Veganes Kollagenpulver (optional)\n - Verschiedene Größen (30g, 70g, 100g)',
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
            'Matcha ist mehr als nur grüner Tee – er ist ein Moment der Ruhe, ein kleines Ritual im Alltag. Anders als herkömmlicher Tee wird Matcha nicht aufgegossen, sondern vollständig getrunken. Genau deshalb kommt es bei der Zubereitung auf jedes Detail an: Temperatur, Qualität und Technik.\n Mit der richtigen Vorbereitung entfaltet Matcha sein volles Aroma – mild, leicht süßlich und angenehm cremig.' ,
        },
        {
          heading: 'Warum die richtige Zubereitung so wichtig ist',
          text:
            'Viele verbinden Matcha mit einem bitteren Geschmack. In den meisten Fällen liegt das jedoch nicht am Matcha selbst, sondern an einer falschen Zubereitung. Zu heißes Wasser oder unzureichendes Aufschlagen können dazu führen, dass der Tee unangenehm schmeckt und seine feinen Nuancen verliert.\n Richtig zubereitet ist Matcha:\n • sanft und ausgewogen\n • angenehm cremig\n • reich an natürlichen Aromen',
        },
        {
          heading: 'Das brauchst du für die Zubereitung',
          text:
            'Für ein authentisches Matcha-Erlebnis empfehlen wir folgende Utensilien:\n •	Hochwertiger Matcha (Ceremonial oder Premium Grade)\n •	Bambusbesen (Chasen)\n •	Matcha-Schale (Chawan)\n •	Bambuslöffel (Chashaku) oder Teelöffel\n •	Heißes, aber nicht kochendes Wasser (70-80°C)',
        },
        {
          heading: 'Schritt-für-Schritt perfekten Matcha',
          text:
            '1. Matcha sieben:\n Gib etwa 1–2 Bambuslöffel Matcha in ein feines Sieb und siebe das Pulver direkt in die Schale. So vermeidest du Klümpchen und erhältst eine besonders feine Textur.\n 2. Wasser richtig erhitzen:\n Erhitze frisches Wasser auf 70–80 °C. Zu heißes Wasser zerstört die empfindlichen Aromen und macht den Matcha bitter.\n 3. Matcha aufschlagen:\n Gieße ca. 70–100 ml Wasser über das Matcha-Pulver.Schlage den Tee mit dem Chasen in schnellen, lockeren W- oder M-Bewegungen, bis sich ein feiner, cremiger Schaum bildet.\n 4. Genießen:\n Nimm dir einen Moment Zeit. Matcha wird traditionell bewusst und in Ruhe getrunken – Schluck für Schluck.',
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

  // COMMUNITY FOTO UPLOAD
  public async upload({ request, response, session }: HttpContext) {
    const image = request.file('image', {
      size: '10mb',
      extnames: ['jpg', 'jpeg', 'png', 'webp'],
    })

    // kein Bild ausgewählt:
    if (!image) {
      session.flash('uploadError', 'Bitte wähle ein Bild aus.')
      await session.commit()
      return response.redirect().back()
    }

    // Bild gewählt, aber ungültig:
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
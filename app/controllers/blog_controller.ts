import type { HttpContext } from '@adonisjs/core/http'
import db from '@adonisjs/lucid/services/db'
import app from '@adonisjs/core/services/app'

type BlogSection = {
  heading: string
  text: string
  image?: string
  recipeId?: number 
}

type BlogPost = {
  id: number
  title: string
  teaser: string
  image: string
  sections: BlogSection[]
}

export default class BlogController {

  private basePosts: BlogPost[] = [
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
      title: 'Rezepte',
      teaser: 'Unsere liebsten Matcha-Rezepte!',
      image: '/images/cheesecakematcha.png',
      sections: [
        {
          recipeId: 101,
          heading: 'Iced Matcha Latte',
          text: 'Der Klassiker – kalt, cremig & schnell gemacht.',
          image: '/images/icedmatchalatte.png',
        },
        {
          recipeId: 102,
          heading: 'Matcha Cheesecake',
          text: 'Cremig & lecker - das perfekte Dessert..!',
          image: '/images/cheesecakematcha.png',
        },
        {
          recipeId: 103,
          heading: 'Strawberry Cloud Matcha',
          text: 'Fluffig & fruchtig – mit cremigem Topping.',
          image: '/images/cloudmatcha.png',
        },
        {
          recipeId: 104,
          heading: 'Coconut Cloud Matcha',
          text: 'Tropisch – mit Kokos für den Extra-Kick.',
          image: '/images/coconutmatcha.png',
        },
        {
          recipeId: 105,
          heading: 'Matcha Greenies',
          text: 'Ein gesunder Snack - und mal was ganz Neues?!',
          image: '/images/browniematcha.png',
        },
        {
          recipeId: 106,
          heading: 'Banana Pudding Matcha',
          text: 'Wie ein süßes Dessert – und super easy.',
          image: '/images/puddingmatcha.png',
        },
        {
          recipeId: 107,
          heading: 'Raspberry Matcha',
          text: 'Fruchtig – Himbeere trifft Matcha.',
          image: '/images/raspberrymatcha.png',
        },
        {
          recipeId: 108,
          heading: 'Matcha Affogato',
          text: 'Eis trifft auf Matcha...',
          image: '/images/affogatomatcha.png',
        },
        {
          recipeId: 109,
          heading: 'Matcha Soda',
          text: 'Spritzig & erfrischend!',
          image: '/images/sodamatcha.png',
        },
      ],
    },

    {
      id: 3,
      title: 'Matcha Zubereitung',
      teaser: 'So gelingt dir dein Matcha zu 100%!',
      image: '/images/matchaschalechasen.png',
      sections: [
        {
          heading: 'Der Weg zum perfekten Matcha: Ein umfassender Guide für puren Genuss',
          text:
            'Matcha ist mehr als nur grüner Tee – er ist eine Erfahrung, ein Ritual und ein wahrer Genuss, der Körper und Geist belebt. Doch um das volle Potenzial dieses edlen Pulvers auszuschöpfen, bedarf es der richtigen Zubereitung. Viele versuchen sich an der Zubereitung und sind vielleicht enttäuscht, wenn das Ergebnis nicht dem in Teehäusern Erlebten entspricht. Mit diesem detaillierten Guide wirst du lernen, wie du Schritt für Schritt den perfekten Matcha zubereitest – cremig, schaumig und voller Aroma.',
        },
        {
          heading: 'Warum die richtige Zubereitung so wichtig ist',
          text:
            'Die Qualität des Matcha-Pulvers ist die Basis, doch die Zubereitung ist der Schlüssel zum Genuss. Falsche Wassertemperatur, unzureichendes Aufschlagen oder falsche Proportionen können den Geschmack bitter oder wässrig machen und die cremige Textur verhindern. Ziel ist es, die feinen Nuancen des Matcha hervorzuheben und eine harmonische Balance zu schaffen.',
        },
        {
          heading: 'Die Essentials für deine Matcha-Zeremonie',
          text:
            'Bevor wir ins Detail gehen, stellen wir sicher, dass du alle notwendigen Utensilien beisammen hast. Diese Werkzeuge sind nicht nur traditionell, sondern auch funktional unerlässlich für die perfekte Zubereitung:\n1. Matcha-Pulver: Wähle stets hochwertigen, zeremoniellen Matcha. Achte auf eine leuchtend grüne Farbe und eine feine, pudrige Textur. Billigerer Matcha ist oft gelblicher und schmeckt herber.\n2. Matcha-Schale (Chawan): Eine breite Schale erleichtert das Aufschlagen und hilft, die Temperatur zu halten.\n3. Bambusbesen (Chasen): Dieses traditionelle Werkzeug ist unverzichtbar, um den Matcha klumpenfrei und schaumig zu schlagen. Die feinen Borsten ermöglichen eine optimale Luftzufuhr.\n4. Bambuslöffel (Chashaku): Zum präzisen Dosieren des Pulvers. Ein Chashaku fasst in der Regel etwa 1 Gramm Matcha.\n5. Matcha-Sieb: Ein feines Sieb ist essenziell, um Klümpchen im Pulver zu vermeiden und eine samtige Textur zu gewährleisten.\n6. Wasserkocher mit Temperaturregelung: Die richtige Wassertemperatur ist entscheidend.\n7. Frisches, gefiltertes Wasser: Die Wasserqualität hat einen großen Einfluss auf den Geschmack.',
        },
        {
          heading: 'Schritt-für-Schritt zum perfekten Matcha',
          text:
            'Folge diesen Schritten sorgfältig, und du wirst im Handumdrehen einen exzellenten Matcha genießen können.',
        },
        {
          heading: 'Schritt 1: Vorbereitung der Utensilien und des Wassers',
          text:
            '1. Wasser erwärmen: Erhitze dein gefiltertes Wasser auf die ideale Temperatur. Für die meisten Matcha-Sorten liegt diese bei 70-80°C. Heißeres Wasser kann den Tee verbrennen und bitter machen, kälteres Wasser löst die Aromen nicht optimal.\n2. Chawan wärmen: Gieße etwas heißes Wasser in deine Matcha-Schale und schwenke es, um die Schale vorzuwärmen. Das hält den Matcha länger warm und erleichtert das Aufschlagen. Gieße das Wasser danach aus und trockne die Schale kurz ab.\n3. Chasen vorbereiten: Tauche die Borsten deines Bambusbesens kurz in das warme Wasser. Das macht die Borsten flexibler und verhindert ein Brechen während des Aufschlagens.',
        },
      ],
    },
  ]
  private getAllPosts(): BlogPost[] {
    const recipesIndex = this.basePosts.find((p) => p.id === 2)

    const recipeDetailPosts: BlogPost[] =
      recipesIndex?.sections
        ?.filter((s) => !!s.recipeId)
        .map((s) => ({
          id: Number(s.recipeId),
          title: s.heading,
          teaser: s.text,
          image: s.image ?? '/images/rezepte.png',
          sections: [
            { heading: s.heading, text: s.text },
            { heading: 'Zutaten', text: 'Hier kannst du später deine Zutatenliste einfügen.' },
            { heading: 'Zubereitung', text: 'Hier kannst du später die Schritte einfügen.' },
          ],
        })) ?? []

    return [...this.basePosts, ...recipeDetailPosts]
  }

  public async index({ view }: HttpContext) {
    const mainPosts = this.basePosts.filter((p) => p.id === 1 || p.id === 2 || p.id === 3)

    const uploaded = await db.from('blog_posts').orderBy('id', 'desc')

    return view.render('pages/blog', {
      posts: mainPosts,
      uploaded,
    })
  }

  public async show({ params, view }: HttpContext) {
    const id = Number(params.id)
    const posts = this.getAllPosts()

    const post = posts.find((p) => p.id === id)

    if (!post) {
      const mainPosts = this.basePosts.filter((p) => p.id === 1 || p.id === 2 || p.id === 3)
      return view.render('pages/blog', { posts: mainPosts })
    }

    return view.render('pages/blog_detail', { post })
  }
  public async upload({ request, response, session }: HttpContext) {
    const image = request.file('image', {
      size: '10mb',
      extnames: ['jpg', 'jpeg', 'png', 'webp'],
    })

    if (!image) {
      session.flash('uploadError', 'Bitte wähle ein Bild aus.')
      await session.commit()
      return response.redirect().back()
    }

    if (!image.isValid) {
      session.flash('uploadError', 'Ungültige Datei. Bitte JPG/PNG/WEBP verwenden (max. 10MB).')
      await session.commit()
      return response.redirect().back()
    }

    const safeName = `${Date.now()}_${image.clientName.replace(/\s+/g, '_')}`

    await image.move(app.publicPath('avatars'), {
      name: safeName,
      overwrite: false,
    })

    if (!image.fileName) {
      session.flash('uploadError', 'Upload fehlgeschlagen. Bitte erneut versuchen.')
      await session.commit()
      return response.redirect().back()
    }

    await db.table('blog_posts').insert({
      title: 'Community Upload',
      teaser: 'Ein Matcha-Moment aus der Community.',
      image: safeName, 
      created_at: new Date(),
    })

    session.flash(
      'uploadSuccess',
      'Wir freuen uns sehr über das Foto. Spare bei deiner nächsten Bestellung 10% mit dem Code "mixcha10"!'
    )
    await session.commit()

    return response.redirect().back()
  }
}
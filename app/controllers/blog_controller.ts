import type { HttpContext } from '@adonisjs/core/http'

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
      teaser: 'Unsere liebsten Matcha-Rezepte!',
      image: '/images/cheesecakematcha.png',
      sections: [
        {
          heading: 'Iced Matcha Latte',
          text: 'Der Klassiker – kalt, cremig & schnell gemacht.',
          image: '/images/icedmatchalatte.png',
        },
        {
          heading: 'Matcha Cheesecake',
          text: 'Cremig & lecker - das perfekte Dessert..!',
          image: '/images/cheesecakematcha.png',      
        },
        {
          heading: 'Strawberry Cloud Matcha',
          text: 'Fluffig & fruchtig – mit cremigem Topping.',
          image: '/images/cloudmatcha.png',
        },
        {
          heading: 'Coconut Cloud Matcha',
          text: 'Tropisch – mit Kokos für den Extra-Kick.',
          image: '/images/coconutmatcha.png',
        },
        {
          heading: 'Matcha Greenies',
          text: 'Ein gesunder Snack - und mal was ganz Neues?!',
          image: '/images/browniematcha.png',
        },
        {
          heading: 'Banana Pudding Matcha',
          text: 'Wie ein süßes Dessert – und super easy.',
          image: '/images/puddingmatcha.png',
        },
        {
          heading: 'Raspberry Matcha',
          text: 'Fruchtig – Himbeere trifft Matcha.',
          image: '/images/raspberrymatcha.png',
        },
        {
          heading: 'Matcha Affogato',
          text: 'Eis trifft auf Matcha...',
          image: '/images/affogatomatcha.png',
        },
        {
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
      text: 'Matcha ist mehr als nur grüner Tee – er ist eine Erfahrung, ein Ritual und ein wahrer Genuss, der Körper und Geist belebt. Doch um das volle Potenzial dieses edlen Pulvers auszuschöpfen, bedarf es der richtigen Zubereitung. Viele versuchen sich an der Zubereitung und sind vielleicht enttäuscht, wenn das Ergebnis nicht dem in Teehäusern Erlebten entspricht. Mit diesem detaillierten Guide wirst du lernen, wie du Schritt für Schritt den perfekten Matcha zubereitest – cremig, schaumig und voller Aroma.',
    },
    {
      heading: 'Warum die richtige Zubereitung so wichtig ist',
      text: 'Die Qualität des Matcha-Pulvers ist die Basis, doch die Zubereitung ist der Schlüssel zum Genuss. Falsche Wassertemperatur, unzureichendes Aufschlagen oder falsche Proportionen können den Geschmack bitter oder wässrig machen und die cremige Textur verhindern. Ziel ist es, die feinen Nuancen des Matcha hervorzuheben und eine harmonische Balance zu schaffen.',
    },
    {
      heading: 'Die Essentials für deine Matcha-Zeremonie',
      text: 'Bevor wir ins Detail gehen, stellen wir sicher, dass du alle notwendigen Utensilien beisammen hast. Diese Werkzeuge sind nicht nur traditionell, sondern auch funktional unerlässlich für die perfekte Zubereitung:\n1. Matcha-Pulver: Wähle stets hochwertigen, zeremoniellen Matcha. Achte auf eine leuchtend grüne Farbe und eine feine, pudrige Textur. Billigerer Matcha ist oft gelblicher und schmeckt herber.\n2. Matcha-Schale (Chawan): Eine breite Schale erleichtert das Aufschlagen und hilft, die Temperatur zu halten.\n3. Bambusbesen (Chasen): Dieses traditionelle Werkzeug ist unverzichtbar, um den Matcha klumpenfrei und schaumig zu schlagen. Die feinen Borsten ermöglichen eine optimale Luftzufuhr.\n4. Bambuslöffel (Chashaku): Zum präzisen Dosieren des Pulvers. Ein Chashaku fasst in der Regel etwa 1 Gramm Matcha.\n5. Matcha-Sieb: Ein feines Sieb ist essenziell, um Klümpchen im Pulver zu vermeiden und eine samtige Textur zu gewährleisten.\n6. Wasserkocher mit Temperaturregelung: Die richtige Wassertemperatur ist entscheidend.\n7.Frisches, gefiltertes Wasser: Die Wasserqualität hat einen großen Einfluss auf den Geschmack.',
    },
    {
      heading: 'Schritt-für-Schritt zum perfekten Matcha',
      text: 'Folge diesen Schritten sorgfältig, und du wirst im Handumdrehen einen exzellenten Matcha genießen können.',
    },
    {
      heading: 'Schritt 1: Vorbereitung der Utensilien und des Wassers',
      text: '1. Wasser erwärmen: Erhitze dein gefiltertes Wasser auf die ideale Temperatur. Für die meisten Matcha-Sorten liegt diese bei 70-80°C. Heißeres Wasser kann den Tee verbrennen und bitter machen, kälteres Wasser löst die Aromen nicht optimal.\n2. Chawan wärmen: Gieße etwas heißes Wasser in deine Matcha-Schale und schwenke es, um die Schale vorzuwärmen. Das hält den Matcha länger warm und erleichtert das Aufschlagen. Gieße das Wasser danach aus und trockne die Schale kurz ab.\n3. Chasen vorbereiten: Tauche die Borsten deines Bambusbesens kurz in das warme Wasser. Das macht die Borsten flexibler und verhindert ein Brechen während des Aufschlagens.',
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

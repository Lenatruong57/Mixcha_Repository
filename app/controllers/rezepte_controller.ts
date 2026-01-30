import type { HttpContext } from '@adonisjs/core/http'

// Typdefinition für ein Rezept.
type Recipe = {
  slug: string
  title: string
  teaser: string
  image: string
  ingredients: string[]
  steps: string[]
}

// Controller für den Rezept-Bereich
export default class RezepteController {
  private recipes: Recipe[] = [
    {
      slug: 'iced-matcha-latte',
      title: 'Iced Matcha Latte',
      teaser: 'Der Klassiker – kalt, cremig & schnell gemacht.',
      image: '/images/icedmatchalatte.png',
      ingredients: [
        '2 TL Matcha',
        '50 ml warmes Wasser (70–80°C)',
        '200 ml kalte Milch (oder Pflanzendrink)',
        'Eiswürfel',
        'Optional: 1–2 TL Honig/Agave',
      ],
      steps: [
        'Matcha durch ein Sieb in eine Schale geben.',
        'Mit warmem Wasser aufgießen und klümpchenfrei verrühren/aufschlagen.',
        'Glas mit Eiswürfeln füllen.',
        'Milch dazugeben und Matcha darüber gießen.',
        'Optional süßen und kurz umrühren.',
      ],
    },
    {
      slug: 'matcha-cheesecake',
      title: 'Matcha Cheesecake',
      teaser: 'Cremig & lecker – das perfekte Dessert..!',
      image: '/images/cheesecakematcha.png',
      ingredients: [
        '200 g Kekse (z. B. Butterkekse)',
        '80 g Butter',
        '400 g Frischkäse',
        '200 g Joghurt/Skyr',
        '80–120 g Zucker',
        '2 TL Matcha',
        '1 TL Vanille',
      ],
      steps: [
        'Kekse zerbröseln, Butter schmelzen, mischen und in die Form drücken.',
        'Frischkäse, Joghurt, Zucker, Vanille glatt rühren.',
        'Matcha sieben und einrühren.',
        'Auf den Boden geben und kalt stellen (oder backen – je nach Rezeptstil).',
      ],
    },
    {
      slug: 'strawberry-cloud-matcha',
      title: 'Strawberry Cloud Matcha',
      teaser: 'Fluffig & fruchtig – mit cremigem Topping.',
      image: '/images/cloudmatcha.png',
      ingredients: [
        '2 TL Matcha',
        '50 ml warmes Wasser',
        '150 ml Milch (kalt)',
        'Eiswürfel',
        '3–4 Erdbeeren (oder Erdbeerpüree)',
        'Optional: Milchschaum/Sahne als Topping',
      ],
      steps: [
        'Erdbeeren zu Püree zerdrücken und ins Glas geben.',
        'Eiswürfel dazu.',
        'Milch einfüllen.',
        'Matcha aufschlagen und oben drauf gießen.',
        'Optional mit Schaum/Sahne toppen.',
      ],
    },
    {
      slug: 'coconut-cloud-matcha',
      title: 'Coconut Cloud Matcha',
      teaser: 'Tropisch – mit Kokos für den Extra-Kick.',
      image: '/images/coconutmatcha.png',
      ingredients: [
        '2 TL Matcha',
        '50 ml warmes Wasser',
        '150–200 ml Kokosdrink (kalt)',
        'Eiswürfel',
        'Optional: Kokoscreme als Topping',
      ],
      steps: [
        'Glas mit Eis füllen.',
        'Kokosdrink eingießen.',
        'Matcha aufschlagen und darüber geben.',
        'Optional Kokoscreme als „Cloud“ oben drauf.',
      ],
    },
    {
      slug: 'matcha-greenies',
      title: 'Matcha Greenies',
      teaser: 'Ein gesunder Snack – und mal was ganz Neues?!',
      image: '/images/browniematcha.png',
      ingredients: [
        '2 reife Bananen',
        '2 Eier (oder Ersatz)',
        '120 g Mehl',
        '2 TL Matcha',
        '1 TL Backpulver',
        '50–80 g Zucker (optional)',
      ],
      steps: [
        'Backofen auf 180°C vorheizen.',
        'Bananen zerdrücken, Eier einrühren.',
        'Trockene Zutaten mischen, Matcha sieben, alles verrühren.',
        'In Form geben und ca. 20–25 Min backen.',
      ],
    },
    {
      slug: 'banana-pudding-matcha',
      title: 'Banana Pudding Matcha',
      teaser: 'Wie ein süßes Dessert – und super easy.',
      image: '/images/puddingmatcha.png',
      ingredients: [
        '1 Banane',
        '200 ml Milch',
        '1 Päckchen Vanillepuddingpulver',
        '1–2 TL Matcha',
        'Optional: Kekse/Granola als Topping',
      ],
      steps: [
        'Pudding nach Packung zubereiten.',
        'Matcha sieben und einrühren.',
        'In Glas schichten: Banane – Pudding – Banane.',
        'Topping drauf und kalt stellen.',
      ],
    },
    {
      slug: 'raspberry-matcha',
      title: 'Raspberry Matcha',
      teaser: 'Fruchtig – Himbeere trifft Matcha.',
      image: '/images/raspberrymatcha.png',
      ingredients: [
        '2 TL Matcha',
        '50 ml warmes Wasser',
        '150 ml Milch (kalt)',
        'Eiswürfel',
        '2–3 EL Himbeerpüree',
      ],
      steps: [
        'Himbeerpüree ins Glas geben.',
        'Eiswürfel dazu, Milch eingießen.',
        'Matcha aufschlagen und oben drauf geben.',
      ],
    },
    {
      slug: 'matcha-affogato',
      title: 'Matcha Affogato',
      teaser: 'Eis trifft auf Matcha...',
      image: '/images/affogatomatcha.png',
      ingredients: [
        '1 Kugel Vanilleeis',
        '2 TL Matcha',
        '60 ml warmes Wasser',
        'Optional: weiße Schokolade als Topping',
      ],
      steps: [
        'Vanilleeis in ein Glas geben.',
        'Matcha aufschlagen.',
        'Matcha über das Eis gießen und sofort servieren.',
      ],
    },
    {
      slug: 'matcha-soda',
      title: 'Matcha Soda',
      teaser: 'Spritzig & erfrischend!',
      image: '/images/sodamatcha.png',
      ingredients: [
        '2 TL Matcha',
        '50 ml warmes Wasser',
        '200 ml Sprudelwasser (kalt)',
        'Eiswürfel',
        'Optional: Zitrone/Limette',
      ],
      steps: [
        'Matcha aufschlagen.',
        'Glas mit Eis füllen.',
        'Sprudelwasser eingießen.',
        'Matcha vorsichtig oben drauf gießen.',
        'Optional mit Zitrus verfeinern.',
      ],
    },
  ]


  // GET /rezepte -> Zeigt die Übersicht aller Rezepte.  
  public async index({ view }: HttpContext) {
    return view.render('pages/rezepte', {
      recipes: this.recipes,
    })
  }

  // GET /rezepte/:slug -> Zeigt die Detailseite eines einzelnen Rezepts  
  public async show({ params, view, response }: HttpContext) {
    const recipe = this.recipes.find((r) => r.slug === String(params.slug))

    if (!recipe) {
      return response.redirect('/rezepte')
    }

    return view.render('pages/rezepte_detail', {
      recipe,
    })
  }

  // Vorschau-Funktion
  public getPreview() {
    return this.recipes.slice(0, 3).map((r) => ({
      slug: r.slug,
      title: r.title,
      image: r.image,
    }))
  }
}
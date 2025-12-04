import type { HttpContext } from '@adonisjs/core/http'
// import db from '@adonisjs/lucid/services/db'

export default class BlogController {
  public async index({ view }: HttpContext) {
    // Später durch DB-Abfrage ersetzen
    const posts = [
      { id: 1, title: 'Matcha Basics', teaser: 'Was ist Matcha eigentlich?' },
      { id: 2, title: 'Rezepte', teaser: 'Latte, Iced Matcha & mehr' },
    ]

    return view.render('pages/blog', {
      posts,
    })
  }

  public async show({ params, view }: HttpContext) {
    const id = Number(params.id)

    // Platzhalter
    const post = {
      id,
      title: `Blog-Artikel #${id}`,
      content: 'Hier steht dein Matcha-Content …',
    }

    return view.render('pages/blog_detail', {
      post,
    })
  }
}
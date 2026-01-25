import type { HttpContext } from '@adonisjs/core/http'
import hash from '@adonisjs/core/services/hash'
import Customer from '#models/customer'
import db from '@adonisjs/lucid/services/db'

export default class LoginController {
  
  // Einstellungen (Rate-Limit)
  private readonly MAX_TRIES = 3
  private readonly LOCK_MS = 2 * 60 * 1000 // 2 Minuten

  // Session-Keys (keine Tippfehler)
  private readonly CUST_TRIES_KEY = 'cust_login_tries'
  private readonly CUST_LOCK_KEY = 'cust_login_lock_until'
  private readonly ADMIN_TRIES_KEY = 'admin_login_tries'
  private readonly ADMIN_LOCK_KEY = 'admin_login_lock_until'

  // Kleine Helpers
  // Einheitlicher Fehlerweg: Flash setzen + commit + Redirect
  private async fail(
    session: HttpContext['session'],
    response: HttpContext['response'],
    path: string,
    message: string
  ) {
    session.flash('error', message)
    await session.commit()
    return response.redirect().toPath(path)
  }

  // Überprüfung: aktuell Sperre?
  private isLocked(session: HttpContext['session'], lockKey: string): boolean {
    const lockUntil = session.get(lockKey) as number | undefined
    return !!lockUntil && Date.now() < lockUntil
  }

  // Erhöht Fehlversuche und setzt ggf. Sperre (gibt neue Try-Anzahl zurück)
  private registerFail(session: HttpContext['session'], triesKey: string, lockKey: string): number {
    const tries = (session.get(triesKey) as number | undefined) ?? 0
    const nextTries = tries + 1

    session.put(triesKey, nextTries)

    // Ab MAX_TRIES wird gesperrt
    if (nextTries >= this.MAX_TRIES) {
      session.put(lockKey, Date.now() + this.LOCK_MS)
    }

    return nextTries
  }

  // Bei Erfolg: Limiter zurücksetzen
  private resetLimiter(session: HttpContext['session'], triesKey: string, lockKey: string) {
    session.forget(triesKey)
    session.forget(lockKey)
  }
  
  // KUNDEN-LOGIN

  // GET /login
  public async index({ view }: HttpContext) {
    return view.render('pages/login')
  }

  // POST /login
  public async loginCustomer({ request, session, response }: HttpContext) {
    // Sperre prüfen
    if (this.isLocked(session, this.CUST_LOCK_KEY)) {
      return this.fail(session, response, '/login', 'Zu viele Login-Versuche. Bitte warte 2 Minuten und versuche es erneut.')
    }

    // Inputs holen + normalisieren
    const email = String(request.input('email') ?? '').trim().toLowerCase()
    const password = String(request.input('password') ?? '')

    if (!email || !password) {
      return this.fail(session, response, '/login', 'Bitte E-Mail und Passwort eingeben.')
    }

    // Benutzer finden
    const customer = await Customer.findBy('email', email)
    if (!customer) {
      const tries = this.registerFail(session, this.CUST_TRIES_KEY, this.CUST_LOCK_KEY)

      // Falls der Versuch die Sperre ausgelöst hat
      if (this.isLocked(session, this.CUST_LOCK_KEY)) {
        return this.fail(session, response, '/login', 'Zu viele Login-Versuche. Bitte warte 2 Minuten und versuche es erneut.')
      }

      return this.fail(session, response, '/login', `E-Mail oder Passwort ist falsch. (${tries}/${this.MAX_TRIES})`)
    }

    // Passwort prüfen (Hash-Verfahren)
    const ok = await hash.verify(customer.password, password)
    if (!ok) {
      const tries = this.registerFail(session, this.CUST_TRIES_KEY, this.CUST_LOCK_KEY)

      if (this.isLocked(session, this.CUST_LOCK_KEY)) {
        return this.fail(session, response, '/login', 'Zu viele Login-Versuche. Bitte warte 2 Minuten und versuche es erneut.')
      }

      return this.fail(session, response, '/login', `E-Mail oder Passwort ist falsch. (${tries}/${this.MAX_TRIES})`)
    }

    // 4) Erfolg: Limiter reset + Rollen sauber trennen + Session setzen
    this.resetLimiter(session, this.CUST_TRIES_KEY, this.CUST_LOCK_KEY)

    session.forget('adminId')
    session.put('customerId', customer.id)

    await session.commit()
    return response.redirect().toPath('/')
  }

  // POST /logout 
  public async logoutCustomer({ session, response }: HttpContext) {
    // sauber beides entfernen (falls jemals beides gesetzt wäre)
    session.forget('customerId')
    session.forget('adminId')

    // Limiter resetten, damit man "sauber" rausgeht
    this.resetLimiter(session, this.CUST_TRIES_KEY, this.CUST_LOCK_KEY)

    await session.commit()
    return response.redirect().toPath('/login')
  }

  
  // HÄNDLER-LOGIN

  // GET /haendler-login
  public async haendlerIndex({ view }: HttpContext) {
    return view.render('pages/login_haendler')
  }

  // POST /haendler-login
  public async loginHaendler({ request, session, response }: HttpContext) {
    // Sperre prüfen
    if (this.isLocked(session, this.ADMIN_LOCK_KEY)) {
      return this.fail(session, response, '/haendler-login', 'Zu viele Login-Versuche. Bitte warte 2 Minuten und versuche es erneut.')
    }

    // Inputs holen + normalisieren
    const username = String(request.input('username') ?? '').trim()
    const password = String(request.input('password') ?? '')

    if (!username || !password) {
      return this.fail(session, response, '/haendler-login', 'Bitte Benutzername und Passwort eingeben.')
    }

    // Admin finden (Querybuilder ist parameterisiert)
    const admin = await db.from('admins').where({ username }).first()
    if (!admin) {
      const tries = this.registerFail(session, this.ADMIN_TRIES_KEY, this.ADMIN_LOCK_KEY)

      if (this.isLocked(session, this.ADMIN_LOCK_KEY)) {
        return this.fail(session, response, '/haendler-login', 'Zu viele Login-Versuche. Bitte warte 2 Minuten und versuche es erneut.')
      }

      return this.fail(session, response, '/haendler-login', `Benutzername oder Passwort ist falsch. (${tries}/${this.MAX_TRIES})`)
    }

    // Passwort prüfen
    const ok = await hash.verify(admin.password, password)
    if (!ok) {
      const tries = this.registerFail(session, this.ADMIN_TRIES_KEY, this.ADMIN_LOCK_KEY)

      if (this.isLocked(session, this.ADMIN_LOCK_KEY)) {
        return this.fail(session, response, '/haendler-login', 'Zu viele Login-Versuche. Bitte warte 2 Minuten und versuche es erneut.')
      }

      return this.fail(session, response, '/haendler-login', `Benutzername oder Passwort ist falsch. (${tries}/${this.MAX_TRIES})`)
    }

    // Erfolg: Limiter reset + Rollen sauber trennen + Session setzen
    this.resetLimiter(session, this.ADMIN_TRIES_KEY, this.ADMIN_LOCK_KEY)

    session.forget('customerId')
    session.put('adminId', admin.id)

    await session.commit()
    return response.redirect().toPath('/admin')
  }

  // POST /haendler-logout (Admin)
  public async logoutHaendler({ session, response }: HttpContext) {
    session.forget('adminId')
    session.forget('customerId')

    // Limiter resetten, damit man "sauber" rausgeht
    this.resetLimiter(session, this.ADMIN_TRIES_KEY, this.ADMIN_LOCK_KEY)

    await session.commit()
    return response.redirect().toPath('/haendler-login')
  }
}
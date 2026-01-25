import router from '@adonisjs/core/services/router'
import server from '@adonisjs/core/services/server'

/**
 * Der Error-Handler fängt alle unbehandelten Fehler ab
 * und wandelt sie in eine HTTP-Antwort um.
 */
server.errorHandler(() => import('#exceptions/handler'))

/**
 * Server-Middleware:
 * Diese Middleware läuft bei JEDER Anfrage,
 * auch wenn keine Route existiert.
 */
server.use([
  // Bindet Container / Services
  () => import('#middleware/container_bindings_middleware'),

  // Liefert statische Dateien aus (CSS, Bilder, JS)
  () => import('@adonisjs/static/static_middleware'),

  // Vite Middleware für Development (HMR)
  () => import('@adonisjs/vite/vite_middleware'),
])

/**
 * Router-Middleware:
 * Diese Middleware läuft nur bei Anfragen,
 * für die es auch eine definierte Route gibt.
 */
router.use([
  // Liest POST-Daten (Formulare, JSON)
  () => import('@adonisjs/core/bodyparser_middleware'),

  // Aktiviert Sessions (Login-Zustand, Flash-Messages etc.)
  () => import('@adonisjs/session/session_middleware'),

  // Sicherheitsfeatures (CSRF-Schutz, XSS-Header, etc.)
  () => import('@adonisjs/shield/shield_middleware'),

  // Eigene Middleware (z. B. Warenkorb-Zähler im Header)
  () => import('#middleware/cart_count_middleware'),
])

/**
 * Benannte Middleware:
 * Diese Middleware wird gezielt in den Routen verwendet,
 * z. B. zum Schutz von Admin- oder Kunden-Seiten.
 */
export const middleware = router.named({
  // Schützt Admin-Bereiche (nur mit adminId in Session)
  admin: () => import('#middleware/admin_middleware'),

  // Schützt Kunden-Bereiche (nur mit customerId in Session)
  customer: () => import('#middleware/customer_middleware'),
})
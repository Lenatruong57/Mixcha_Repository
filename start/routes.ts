import router from '@adonisjs/core/services/router'
import type { HttpContext } from '@adonisjs/core/http'
import type { NextFn } from '@adonisjs/core/types/http'

import HomeController from '#controllers/home_controller'
import ProdukteController from '#controllers/produkte_controller'
import WarenkorbsController from '#controllers/warenkorbs_controller'
import CheckoutsController from '#controllers/checkouts_controller'
import LoginController from '#controllers/login_controller'
import BlogController from '#controllers/blog_controller'
import AgbsController from '#controllers/agbs_controller'
import ImpressumsController from '#controllers/impressums_controller'
import DatenschutzsController from '#controllers/datenschutzs_controller'
import UserController from '#controllers/user_controller'
import RegistrierungsController from '#controllers/registrierungs_controller'
import AdminController from '#controllers/admin_controller'
import { middleware } from './kernel.js'

const noCache = async ({ response }: HttpContext, next: NextFn) => {
  response.header('Cache-Control', 'no-store')
  response.header('Pragma', 'no-cache')
  response.header('Expires', '0')
  await next()
}

router.get('/', [HomeController, 'index']).use(noCache)
router.get('/produkte', [ProdukteController, 'index']).use(noCache)
router.get('/produkte/:id', [ProdukteController, 'show']).use(noCache)
router.get('/warenkorb', [WarenkorbsController, 'index'])
router.get('/checkout', [CheckoutsController, 'index'])
router.get('/checkout/success', [CheckoutsController, 'success'])
router.get('/login', [LoginController, 'index']).use(noCache)
router.get('/registrieren', [RegistrierungsController, 'index'])
router.get('/blog', [BlogController, 'index'])
router.get('/blog/:id', [BlogController, 'show'])
router.get('/agb', [AgbsController, 'index'])
router.get('/impressum', [ImpressumsController, 'index'])
router.get('/datenschutz', [DatenschutzsController, 'index'])
router.get('/user', [UserController, 'index']).use(noCache)
router.get('/haendler-login', [LoginController, 'haendlerIndex']).use(noCache)
router.get('/admin', [AdminController, 'index']).use(middleware.admin()).use(noCache)
router.get('/admin/produkte/new', [AdminController, 'new']).use(middleware.admin()).use(noCache)
router.get('/admin/produkte/:id/edit', [AdminController, 'edit']).use(middleware.admin()).use(noCache)
router.get('/profil', [UserController, 'index']).use(middleware.customer()).use(noCache)
router.get('/profil/edit', [UserController, 'edit']).use(middleware.customer()).use(noCache)
router.get('/profil/bearbeiten', [UserController, 'edit']).use(middleware.customer())

router.post('/login', [LoginController, 'loginCustomer'])
router.post('/registrieren', [RegistrierungsController, 'register'])
router.post('/haendler-login', [LoginController, 'loginHaendler'])
router.post('/checkout/process', [CheckoutsController, 'process'])
router.post('/warenkorb/add', [WarenkorbsController, 'add'])
router.post('/warenkorb/remove', [WarenkorbsController, 'remove'])
router.post('/warenkorb/qty', [WarenkorbsController, 'updateQty'])
router.post('/admin/produkte/:id', [AdminController, 'update']).use(middleware.admin())
router.post('/admin/produkte/:id/delete', [AdminController, 'destroy']).use(middleware.admin())
router.post('/haendler-logout', [LoginController, 'logoutHaendler'])
router.post('/logout', [LoginController, 'logoutCustomer'])
router.post('/admin/produkte', [AdminController, 'store']).use(middleware.admin()).use(noCache)
router.post('/profil', [UserController, 'update']).use(middleware.customer()).use(noCache)

// Debug-session für Entwicklung
// router.get('/debug-session', async ({ session }) => {
//   return {
//     sessionAll: session.all(),
//   }
// })


import router from '@adonisjs/core/services/router'
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
import HaendlerloginsController from '#controllers/haendlerlogins_controller'
import AdminController from '#controllers/admin_controller'
import { middleware } from './kernel.js'

router.get('/', [HomeController, 'index'])
router.get('/produkte', [ProdukteController, 'index'])
router.get('/produkte/:id', [ProdukteController, 'show'])
router.get('/warenkorb', [WarenkorbsController, 'index']).as('cart.index')
router.get('/checkout', [CheckoutsController, 'index'])
router.get('/checkout/success', [CheckoutsController, 'success'])
router.get('/login', [LoginController, 'index'])
router.get('/registrieren', [RegistrierungsController, 'index'])
router.get('/blog', [BlogController, 'index'])
router.get('/blog/:id', [BlogController, 'show'])
router.get('/agb', [AgbsController, 'index'])
router.get('/impressum', [ImpressumsController, 'index'])
router.get('/datenschutz', [DatenschutzsController, 'index'])
router.get('/user', [UserController, 'index'])
router.get('/haendler-login', [HaendlerloginsController, 'index'])
router.get('/admin', [AdminController, 'index']).use(middleware.admin())
router.get('/admin/produkte/new', [AdminController, 'new']).use(middleware.admin())
router.post('/admin/produkte', [AdminController, 'store']).use(middleware.admin())
router.get('/admin/produkte/:id/edit', [AdminController, 'edit']).use(middleware.admin())
router.get('/profil', [UserController, 'index']).use(middleware.customer())

router.post('/login', [LoginController, 'loginCustomer'])
router.post('/registrieren', [RegistrierungsController, 'register'])
router.post('/haendler-login', [HaendlerloginsController, 'login'])
router.post('/haendler-logout', [HaendlerloginsController, 'logout'])
router.post('/checkout/process', [CheckoutsController, 'process'])
router.post('/warenkorb/add', [WarenkorbsController, 'add']).as('cart.add')
router.post('/warenkorb/update', [WarenkorbsController, 'update']).as('cart.update')
router.post('/warenkorb/remove-item', WarenkorbsController.removeItem).as('cart.removeItem')
router.post('/warenkorb/clear', [WarenkorbsController, 'clear']).as('cart.clear')
router.post('/user/login', [UserController, 'login'])
router.post('/warenkorb/add', [WarenkorbsController, 'add'])
router.post('/warenkorb/update-quantity', [WarenkorbsController, 'updateQuantity'])
router.post('/warenkorb/remove-item', [WarenkorbsController, 'removeItem'])
router.post('/admin/produkte/:id', [AdminController, 'update']).use(middleware.admin())
router.post('/admin/produkte/:id/delete', [AdminController, 'destroy']).use(middleware.admin())
router.post('/logout', [LoginController, 'logout'])
router.post('/warenkorb/update', [WarenkorbsController, 'update']).as('cart.update')
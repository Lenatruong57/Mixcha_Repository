import router from '@adonisjs/core/services/router'

// Controller imports
import HomeController from '#controllers/home_controller'
import ProdukteController from '#controllers/produktes_controller'
import WarenkorbsController from '#controllers/warenkorbs_controller'
import CheckoutsController from '#controllers/checkouts_controller'
import LoginController from '#controllers/login_controller'
import BlogController from '#controllers/blog_controller'
import AgbsController from '#controllers/agbs_controller'
import ImpressumsController from '#controllers/impressums_controller'
import DatenschutzsController from '#controllers/datenschutzs_controller'
import UserController from '#controllers/user_controller'

router.get('/', [HomeController, 'index'])
router.get('/produkte', [ProdukteController, 'index'])
router.get('/produkte/:id', [ProdukteController, 'show'])
router.get('/warenkorb', [WarenkorbsController, 'index'])
router.get('/checkout', [CheckoutsController, 'index'])
router.get('/checkout/success', [CheckoutsController, 'success'])
router.get('/login', [LoginController, 'index'])
router.get('/blog', [BlogController, 'index'])
router.get('/blog/:id', [BlogController, 'show'])
router.get('/agb', [AgbsController, 'index'])
router.get('/impressum', [ImpressumsController, 'index'])
router.get('/datenschutz', [DatenschutzsController, 'index'])
router.get('/user',[UserController,'index'])

router.post('/login', [LoginController, 'login'])
router.post('/logout', [LoginController, 'logout'])
router.post('/checkout/process', [CheckoutsController, 'process'])
router.post('/warenkorb/add', [WarenkorbsController, 'add'])
router.post('/warenkorb/update-quantity', [WarenkorbsController, 'updateQuantity'])
router.post('/warenkorb/remove-item', [WarenkorbsController, 'removeItem'])
router.post('/user',[UserController,'login'])
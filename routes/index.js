var express = require('express');
var router = express.Router();
var HomeController = require('../Controllers/HomeController');
var homeController = new HomeController();
var CartController = require('../Controllers/CartController');
var cartController = new CartController();
var CategoryController = require('../Controllers/CategoryController');
var categoryController = new CategoryController();
var CheckOutController = require('../Controllers/CheckOutController');
var checkoutController = new CheckOutController();
var ProductController = require('../Controllers/ProductController');
var productController = new ProductController();
var SearchController = require('../Controllers/SearchController');
var searchController = new SearchController();
var LoginController = require('../Controllers/LoginController');
var loginController = new LoginController();
var HistoryController = require('../Controllers/HistoryController');
var historyController = new HistoryController();

/* Router here. */
router.get('/home', homeController.getIndex);
router.get('/category', categoryController.getCategory);
//Cart
router.get('/cart', cartController.getCart);
router.post('/addToCart',cartController.addToCart);
router.post('/removeProduct',cartController.removeProduct);
router.post('/updateProduct',cartController.updateProduct);

router.get('/checkout', checkoutController.getCheckOut);
router.post('/checkout', checkoutController.postCheckOut);

//Product
router.get('/product/:productID', productController.getProduct);
router.post('/product/:productID',productController.postComment);


router.get('/search', searchController.getSearch);
router.get('/login',loginController.getLogin);
router.post('/login',loginController.postLogin);
router.get('/logout',loginController.getLogout);
router.get('/',homeController.getIndex);
router.get('/sign-up',loginController.getSignUp);
router.post('/sign-up',loginController.postSignUp);
router.get('/activeAccount',loginController.activeAccount);
router.get('/forgotPass',loginController.getForgotPass);
router.post('/forgotPass',loginController.postForgotPass);
router.get('/retrivePassword',loginController.retrivePassword);
router.post('/retrivePassword',loginController.postRetrivePassword);

router.get('/update-info',loginController.getUpdateInfo);
router.post('/update-info',loginController.postUpdateInfo);
router.get('/history',historyController.getHistory);
module.exports = router;

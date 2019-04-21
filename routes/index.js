var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('home');
});
router.get('/category', function(req, res, next) {
  res.render('category');
});
router.get('/cart', function(req, res, next) {
  res.render('cart');
});
router.get('/checkout', function(req, res, next) {
  res.render('checkout');
});
module.exports = router;

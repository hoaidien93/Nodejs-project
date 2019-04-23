var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/home', function(req, res, next) {
  res.render('home',{isLogin: true});
});
router.get('/category', function(req, res, next) {
  res.render('category',{isLogin: true});
});
router.get('/cart', function(req, res, next) {
  res.render('cart',{isLogin: true});
});
router.get('/checkout', function(req, res, next) {
  res.render('checkout',{isLogin: true});
});
router.get('/product', function(req, res, next) {
  res.render('product',{isLogin: true});
});
router.get('/search', function(req, res, next) {
  res.render('search',{isLogin: true});
});
router.get('/login',(req,res)=>{
  res.render('login',{isLogin: false});
});
router.get('/',(req,res)=>{
  res.render('login',{isLogin: false});
});
router.get('/sign-up',(req,res)=>{
  res.render('signUp',{isLogin: false});
});
router.get('/forgotPass',(req,res)=>{
  res.render('forgotPass',{isLogin: false});
});
module.exports = router;

var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/home', function(req, res, next) {
  res.render('home',{isLogin: true,title: "Trang chủ"});
});
router.get('/category', function(req, res, next) {
  res.render('category',{isLogin: true, title: "Danh sách sản phẩm"});
});
router.get('/cart', function(req, res, next) {
  res.render('cart',{isLogin: true, title: "Giỏ hàng"});
});
router.get('/checkout', function(req, res, next) {
  res.render('checkout',{isLogin: true, title: "Thanh toán"});
});
router.get('/product', function(req, res, next) {
  res.render('product',{isLogin: true, title: "Chi tiết sản phẩm"});
});
router.get('/search', function(req, res, next) {
  res.render('search',{isLogin: true, title: "Tìm kiếm"});
});
router.get('/login',(req,res)=>{
  res.render('login',{isLogin: false, title: "Đăng nhập"});
});
router.get('/',(req,res)=>{
  res.render('login',{isLogin: false,title: "Đăng nhập"});
});
router.get('/sign-up',(req,res)=>{
  res.render('signUp',{isLogin: false, title: "Đăng ký"});
});
router.get('/forgotPass',(req,res)=>{
  res.render('forgotPass',{isLogin: false, title: "Quên mật khẩu"});
});
router.get('/update-info',(req,res)=>{
  res.render('updateInfo',{isLogin: true,title: "Tài khoản của tôi"});
});
router.get('/history',(req,res)=>{
  res.render('history',{isLogin: true, title: "Lịch sử"});
});
module.exports = router;

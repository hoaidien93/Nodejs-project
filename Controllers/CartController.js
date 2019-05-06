class CartController{
    getCart(req,res){
        return res.render('Cart/cart',{isLogin: true, title: "Giỏ hàng"});
    }
}

module.exports = CartController;
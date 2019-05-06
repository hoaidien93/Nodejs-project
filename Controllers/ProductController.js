class ProductController{
    getProduct(req,res){
        return res.render('Products/product',{isLogin: true, title: "Chi tiết sản phẩm"});
    }
}

module.exports = ProductController;
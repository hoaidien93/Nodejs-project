var Model = require('../Model/Model');
var model = new Model();
class ProductController{
    async getProduct(req,res){
        // Get product ID
        var productID = req.query.productID;

        var result = await model.getProductDetail(productID);
        if(result.length === 0){
            return res.render('Home/home',{isLogin: true, title: "Trang chủ"});
        }
        return res.render('Products/product',{isLogin: true, title: "Chi tiết sản phẩm", product : result[0]});
    }
}

module.exports = ProductController;
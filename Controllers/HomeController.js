var Model = require('../Model/Model');
var model = new Model();
class HomeController{
    async getIndex(req,res){
        let limitNewProduct = 6;
        let limitBestSelling = 3;

        var newProducts = await model.getNewProduct(limitNewProduct);
        var bestSelling = await model.getBestSelling(limitBestSelling);

        // new Products for 3 item
        var childNewProduct = [];
        for(var i = 0;i < 3;i++){
            childNewProduct.push(newProducts[i]);
        }

        return res.render('Home/home',{isLogin: true,title: "Trang chủ", newProducts : newProducts,bestSelling: bestSelling, childNewProduct: childNewProduct });
    }
}

module.exports = HomeController;
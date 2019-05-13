var Model = require('../Model/Model');
var model = new Model();
class CatergoryController{
    getCategory(req,res){
        model.getListProduct({}).then(function(result){
            return res.render('Category/category',{isLogin: true, title: "Danh sách sản phẩm", products: result});
        });
    }
}

module.exports = CatergoryController;
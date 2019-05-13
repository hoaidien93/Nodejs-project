var Model = require('../Model/Model');
var model = new Model();
class CatergoryController{
    getCategory(req,res){
        //
        model.getListProduct({}).then(function(res){
            console.log(res);
        });
        
        return res.render('Category/category',{isLogin: true, title: "Danh sách sản phẩm"});
    }
}

module.exports = CatergoryController;
class CatergoryController{
    getCategory(req,res){
        return res.render('Category/category',{isLogin: true, title: "Danh sách sản phẩm"});
    }
}

module.exports = CatergoryController;
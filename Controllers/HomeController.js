class HomeController{
    getIndex(req,res){
        return res.render('Home/home',{isLogin: true,title: "Trang chủ"});
    }
}

module.exports = HomeController;
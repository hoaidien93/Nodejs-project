class InfoController{
    getUpdateInfo(req,res){
        return res.render('Info/updateInfo',{isLogin: true,title: "Tài khoản của tôi"});
    }
}

module.exports = InfoController;
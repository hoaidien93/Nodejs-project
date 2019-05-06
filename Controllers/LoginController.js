class LoginController{
    getLogin(req,res){
        return res.render('Login/login',{isLogin: false, title: "Đăng nhập"});
    }

    getSignUp(req,res){
        return res.render('Login/signUp',{isLogin: false, title: "Đăng ký"});
    }

    getForgotPass(req,res){
        return res.render('Login/forgotPass',{isLogin: false, title: "Quên mật khẩu"});
    }
}

module.exports = LoginController;
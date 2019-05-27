var Model = require('../Model/Model');
var model = new Model();
const bcrypt = require('bcrypt');
const saltRounds = 10;
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

    async postSignUp(req,res){
        var name = req.body.name || "";
        var email = req.body.email || "";
        var password = req.body.password || "";
        var phoneNumber = req.body.phoneNumber || "";
        console.log(phoneNumber);
        if(name && email && password && phoneNumber){
            password = await bcrypt.hash(password, saltRounds);
            var account = {
                "userName" : name,
                "email" : email,
                "password" : password,
                "phoneNumber" : phoneNumber,
                "authority": "users"
            };
            var result = await model.createAccount(account);
            if(result){
                res.render('Login/login',{Notify: true});
            };
        }
        return res.render('Login/signUp',{Notify: true});
    }

    async postLogin(req,res){
        var userName = req.body.username;
        var password = req.body.pass;
        // Get Info of account
        var account = await model.getAccount({"email" : userName});
        if(account.length === 1){
            var result = await bcrypt.compare(password, account[0].password);
            console.log(result);
            if (result){
                // Store session
                var sess = req.session;
                sess.email = userName;

                return res.redirect("/home");
            }
        }
        return res.render('Login/login', {isLoginFail : true});
    }

    async getUpdateInfo(req,res){
         // Get session
        var sess = req.session;
        if (typeof sess.email === 'undefined') {
            return res.redirect('/login');
        }
        var account = await model.getAccount({"email": sess.email});
        return res.render('Login/updateInfo',{isLogin: true,title: "Tài khoản của tôi", account: account[0]});
    }

    async postUpdateInfo(req,res){
        var sess = req.session;
        if (typeof sess.email === 'undefined') {
            return;
        }
        var sess = req.session;
        var userName = req.body.name;
        var phoneNumber = req.body.phone;
        var password = req.body.password || "";
        var accountUpdate = {
            "userName": userName,
            "phoneNumber": phoneNumber,
        };
        if(password){
            password = await bcrypt.hash(password, saltRounds);
            accountUpdate.password = password;
        }

        var result = await model.updateInfo(sess.email,accountUpdate);
        return res.redirect('/update-info');
    }
}

module.exports = LoginController;
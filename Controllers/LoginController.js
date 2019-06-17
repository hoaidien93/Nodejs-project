var Model = require('../Model/Model');
var model = new Model();
const bcrypt = require('bcrypt');
var crypto = require("crypto");
var Mailer = require("./Mailer");
var mailer = new Mailer();
const saltRounds = 10;
class LoginController {

    getLogin(req, res) {
        var retrivePass = req.query.retrivePassword || "";
        return res.render('Login/login', { isLogin: false, title: "Đăng nhập", retrivePass: retrivePass });
    }

    getSignUp(req, res) {
        return res.render('Login/signUp', { isLogin: false, title: "Đăng ký" });
    }

    getForgotPass(req, res) {
        return res.render('Login/forgotPass', { isLogin: false, title: "Quên mật khẩu" });
    }

    async postForgotPass(req, res) {
        // get Email
        var email = req.body.email || "";
        // Generator token to active 
        // Check exists email
        var account = await model.getAccount(email);
        if (account.length === 0) {
            return res.render('Login/forgotPass', {
                notExists: true
            })
        }
        var token = crypto.randomBytes(20).toString('hex');
        // Add to Db token
        model.updateToken(email, token);
        var fullUrl = req.protocol + '://' + req.get('host');
        var subject = "Lấy lại mật khẩu";
        var link = `${fullUrl}/retrivePassword?email=${email}&token=${token}`;
        var content = `
            <p>Chào mừng bạn đến với trung tâm mua sắm trực tuyến</p>
            <p>Vui lòng click vào link để lấy lại mật khẩu</p>
            <a href="${link}">Lấy lại</a>
        `;
        mailer.sendMail(email, subject, content);
        return res.render('Login/forgotPass', {
            sended: true
        })
    }

    async retrivePassword(req, res) {
        var email = req.query.email || "";
        var token = req.query.token || "";

        var isCorrectToken = await model.checkToken(email, token);

        if (!isCorrectToken) {
            return res.send("Something went wrong");
        }

        res.render("Login/retrivePassword");
    }

    async postRetrivePassword(req, res) {
        var email = req.query.email || "";
        var token = req.query.token || "";

        var isCorrectToken = await model.checkToken(email, token);

        if (!isCorrectToken) {
            return res.send("Something went wrong");
        }

        // get new password
        var password = req.body.password || "";
        password = await bcrypt.hash(password, saltRounds);
        model.updatePassword(email, password);

        return res.redirect("/login?retrivePassword=true");
    }

    async postSignUp(req, res) {
        var name = req.body.name || "";
        var email = req.body.email || "";
        var password = req.body.password || "";
        var phoneNumber = req.body.phoneNumber || "";
        if (name && email && password && phoneNumber) {
            // Generator token to active account
            var token = crypto.randomBytes(20).toString('hex');
            password = await bcrypt.hash(password, saltRounds);
            var account = {
                "userName": name,
                "email": email,
                "password": password,
                "phoneNumber": phoneNumber,
                "authority": "users",
                "active": "0",
                "token": token
            };
            var fullUrl = req.protocol + '://' + req.get('host');
            var linkActive = `${fullUrl}/activeAccount?email=${email}&token=${token}`;
            var subject = "Kích hoạt tài khoản";
            var content = `
                <p>Chào mừng bạn đến với trung tâm mua sắm trực tuyến</p>
                <p>Vui lòng click vào link bên dưới để hoàn tất thủ tục đăng ký</p>
                <a href="${linkActive}">Kích hoạt</a>
            `;
            mailer.sendMail(email, subject, content);
            //
            var result = await model.createAccount(account);
            if (result) {
                res.render('Login/login', { Notify: true });
            };
        }
        return res.render('Login/signUp', { Notify: true });
    }

    async postLogin(req, res) {
        var email = req.body.username;
        var password = req.body.pass;
        // Get Info of account
        var account = await model.getAccount({ "email": email });
        if (account.length === 1) {
            var result = await bcrypt.compare(password, account[0].password);
            if (result) {
                // Check if account unactive
                if (account[0].active === "1") {
                    // Store session
                    var sess = req.session;
                    sess.email = email;
                    sess.userName = account[0].userName;
                    return res.redirect("/home");
                }
                return res.render('Login/login', { unactive: true });
            }
        }
        return res.render('Login/login', { isLoginFail: true });
    }

    async getUpdateInfo(req, res) {
        // Get session
        var sess = req.session;
        var total = sess.total || "0";
        total = total.toString().replace(/(.)(?=(\d{3})+$)/g,'$1.')
        total += " VNĐ";
        var count = sess.count || 0;
        var updated = req.query.updated;
        var notCorrectPassword = req.query.notCorrectPassword;

        if (typeof sess.email === 'undefined') {
            return res.redirect('/login');
        }
        var account = await model.getAccount({ "email": sess.email });
        return res.render('Login/updateInfo', {
            isLogin: true,
            title: "Tài khoản của tôi",
            account: account[0],
            updated: updated,
            notCorrectPassword: notCorrectPassword,
            total: total,
            count: count
        });
    }

    async postUpdateInfo(req, res) {
        var sess = req.session;
        if (typeof sess.email === 'undefined') {
            return res.send("Something went wrong");
        }
        var email = sess.email;
        var userName = req.body.name;
        var phoneNumber = req.body.phone;
        var password = req.body.password || "";
        var oldPassword = req.body.oldPassword || "";
        var account = await model.getAccount({ "email": email });
        if (account.length === 1) {
            var accountUpdate = {
                "userName": userName,
                "phoneNumber": phoneNumber,
            };
            // Change password
            if (password) {
                var result = await bcrypt.compare(oldPassword, account[0].password);
                if (result) {
                    password = await bcrypt.hash(password, saltRounds);
                    accountUpdate.password = password;
                }
                else{
                    return res.redirect('/update-info?notCorrectPassword=true');
                }
            }
            var result = await model.updateInfo(sess.email, accountUpdate);
            return res.redirect('/update-info?updated=true');
            
        }
        return res.send("Something went wrong");
    }

    async activeAccount(req, res) {
        var email = req.query.email || "";
        var token = req.query.token || "";

        var result = await model.activeAccount(email, token);

        if (result.length === 0) return res.send("Something went wrong!");
        // Store session
        var sess = req.session;
        sess.email = email;
        sess.userName = result;
        return res.redirect("/home?status=ActiveSuccess");
    }

    getLogout(req,res){
        req.session.destroy(function (err) {
            if (err) throw err;
        });
        return res.redirect('/login');
    }
}

module.exports = LoginController;
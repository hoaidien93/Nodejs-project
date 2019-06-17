var Model = require("../Model/Model");
var model = new Model();
class HistoryController{

    async getHistory(req,res){
        var sess = req.session;
        var total = sess.total || "0";
        total = total.toString().replace(/(.)(?=(\d{3})+$)/g,'$1.')
        total += " VNĐ";
        var count = sess.count || 0;
        var logged = true;
        if(typeof(sess.email) === "undefined"){
            logged = false;
        }

        if(typeof(sess.email) === "undefined"){
            return res.redirect("/login");
        }
        // Get history
        var history = await model.getHistory(sess.email);
        history.forEach(element => {
            var dateTime = new Date(element.date);
            var time = dateTime.getHours() + ":" + dateTime.getMinutes() + ":" + dateTime.getSeconds();
            var day = dateTime.getDate() + '/' + (dateTime.getMonth() + 1) + '/' + dateTime.getFullYear();
            element.time = time;
            element.day = day;

            // Format string
            var totalPrive = parseInt(element.total);
            totalPrive = totalPrive.toString().replace(/(.)(?=(\d{3})+$)/g,'$1.') + " VNĐ";
            element.total = totalPrive;
        });
        // New products
        var newProducts = await model.getNewProduct(5);
        return res.render('History/history',{
            isLogin: true,
            title: "Lịch sử",
            history: history,
            total: total,
            count: count,
            newProducts : newProducts,
            logged: logged
        });
    }
}

module.exports = HistoryController;
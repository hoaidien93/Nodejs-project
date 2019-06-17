var Model = require('../Model/Model');
var model = new Model();
class HomeController {

    async getIndex(req, res) {
        var status = req.query.status || "";
        // Check session
        var sess = req.session;
        var total = sess.total || "0";
        var logged = true;
        if(typeof(sess.email) === "undefined"){
            logged = false;
        }
        total = total.toString().replace(/(.)(?=(\d{3})+$)/g,'$1.')
        total += " VNĐ";
        var count = sess.count || 0;
        let limitNewProduct = 6;
        let limitBestSelling = 3;
        var checkOutSuccess = req.query.checkOutSuccess || false;
        var newProducts = await model.getNewProduct(limitNewProduct);
        var bestSelling = await model.getBestSelling(limitBestSelling);

        // new Products for 3 item
        var childNewProduct = [];
        for (var i = 0; i < 3; i++) {
            childNewProduct.push(newProducts[i]);
        }
        var renderData = {
            isLogin: true,
            title: "Trang chủ",
            newProducts: newProducts,
            bestSelling: bestSelling,
            childNewProduct: childNewProduct,
            total: total,
            count: count,
            logged: logged,
            checkOutSuccess: checkOutSuccess
        };
        if (status == "ActiveSuccess"){
            renderData.status = true;
        }
        return res.render('Home/home',  renderData);
    }
}

module.exports = HomeController;
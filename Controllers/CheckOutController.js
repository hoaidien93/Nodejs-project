var Model = require("../Model/Model");
var model = new Model();
class CheckOutController{
    async getCheckOut(req,res){
        // Get session
        var sess = req.session;
        if (typeof sess.email === 'undefined') {
            return res.redirect('/login');
        }
        var newProducts = await model.getNewProduct(5);
        var total = sess.total || "0";
        var total = total.toString().replace(/(.)(?=(\d{3})+$)/g,'$1.');
        total += " VNĐ";
        var count = sess.count || 0;

        // Get cart info
        if(typeof(sess.cart) === "undefined") sess.cart = [];
        var cart = sess.cart;
        for (var element of cart) {
            var totalPrice = parseInt(element.price.replace(/\./g, '')) * element.quantity;
            // Format total
            totalPrice = totalPrice.toString().replace(/(.)(?=(\d{3})+$)/g,'$1.')
            element.total = totalPrice;
        };
        return res.render('CheckOut/checkout',{
            isLogin: true,
            title: "Thanh toán",
            total: total,
            count: count,
            newProducts: newProducts,
            cart : cart
        });
    }

    async postCheckOut(req,res){
        var sess = req.session;
        if (typeof sess.email === 'undefined') {
            return res.send('Something went wrong');
        }
        if (typeof(sess.cart) === "undefined"){
            return res.send('Something went wrong');
        }
        var address = req.body.address;
        // Store Db
        for(var productInfo of sess.cart){
           await model.storeOrder(productInfo.productID,productInfo.quantity,sess.email,address,"Đã nhận");
        }
        // Update in history
        model.updateHistory(sess.email,sess.total);
        //Clear session cart
        sess.cart = [];
        sess.total = 0;
        sess.count = 0;
        //
        return res.redirect("/home");
    }
}

module.exports = CheckOutController;
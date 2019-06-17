var Model = require('../Model/Model');
var model = new Model();
class CartController {

    async getCart(req, res) {
        var sess = req.session;
        var total = sess.total || 0;
        // Format total
        total = total.toString().replace(/(.)(?=(\d{3})+$)/g,'$1.')
        total += " VNĐ";
        var logged = true;
        if(typeof(sess.email) === "undefined"){
            logged = false;
        }
        var count = sess.count || 0;
        // Get Cart
        var cart = sess.cart || [];
        var product;
        for (var element of cart) {
            product = await model.getProduct(element.productID);
            element.name = product[0].name;
            element.price = product[0].newPrice;
            var intTotal = parseInt(product[0].newPrice.replace(/\./g, '')) * element.quantity;
            element.total = intTotal.toString().replace(/(.)(?=(\d{3})+$)/g,'$1.');
            element.img = product[0].img;
        };
        // Get new product
        var newProducts = await model.getNewProduct(5);

        return res.render('Cart/cart', {
            isLogin: true,
            title: "Giỏ hàng",
            total: total,
            cart: cart,
            count: count,
            newProducts: newProducts,
            logged: logged
        });
    }

    async addToCart(req, res) {
        var productID = req.body.productID;
        if (typeof (productID) === "undefined") {
            return res.send({
                status: "Fail"
            });
        }
        // Check productID is exists
        var productInfo = await model.getProduct(productID);

        if (productInfo.length === 0) {
            return res.send({
                status: "Fail"
            });
        }

        // Add in session
        var sess = req.session;
        if (typeof (sess.cart) === "undefined") sess.cart = [];
        var cart = sess.cart;
        var isExistsInCart = false;
        cart.forEach((element) => {
            if (element.productID === productID) {
                element.quantity += 1;
                isExistsInCart = true;
            }
        });
        if (!isExistsInCart) {
            cart.push({
                productID: productID,
                quantity: 1,
                price: productInfo[0].newPrice,
                name: productInfo[0].name
            });
        }
        // Update total
        var total = sess.total || 0;
        var count = sess.count || 0;
        count += 1;
        sess.count = count;
        total += parseInt(productInfo[0].newPrice.replace(/\./g, ''));
        sess.total = total;
        return res.send({
            status: "Success"
        });
    }

    async removeProduct(req, res) {
        var productID = req.body.productID;
        if (typeof (productID) === "undefined") {
            return res.send({
                status: "Fail"
            });
        }

        var sess = req.session;
        if (typeof (sess.cart) === "undefined") sess.cart = [];
        var cart = sess.cart;
        for (var i = 0; i < cart.length; i++) {
            if (cart[i].productID === productID) {
                // Update total
                var product = await model.getProduct(cart[i].productID);
                sess.total -= parseInt(product[0].newPrice.replace(/\./g, '')) * cart[i].quantity;
                sess.count -= cart[i].quantity;

                cart.splice(i, 1);
            }
        };
        return res.send({
            status: "Success"
        });
    }

    updateProduct(req,res){
        var arrChange = req.body;
        var sess = req.session;

        if(typeof(sess.cart) === "undefined") return res.send({
           'status' : "Fail"
        });

        var cart = sess.cart;
        for(var i = 0;i < cart.length; i++){
            for(var j=0;j<arrChange.length;j++){
                if(cart[i].productID === arrChange[j].productID){
                    var oldQty = cart[i].quantity;
                    var newQty = arrChange[j].quantity;
                    // Update qty
                    cart[i].quantity = newQty;
                    // update count
                    sess.count = sess.count - parseInt(oldQty) + parseInt(newQty);
                    // Update total
                    var price = parseInt(cart[i].price.replace(/\./g, ''));
                    sess.total = sess.total + (parseInt(newQty) - parseInt(oldQty))* price;

                }
            }
        }
        return res.send({
            'status': "Success"
        });
        
    }
}

module.exports = CartController;
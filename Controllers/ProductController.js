var Model = require('../Model/Model');
var model = new Model();
const PAGE_SIZE = 10;

class ProductController{
    async getProduct(req,res){

        // Get session
        var sess = req.session;
        var total = sess.total || "0";
        var total = total.toString().replace(/(.)(?=(\d{3})+$)/g,'$1.');
        total += " VNĐ";
        var count = sess.count || 0;

        // Get product ID
        var productID = req.params.productID;
        // Get page comment
        var pageComment = req.query.page || 1;
        // Get total page comment
        var totalPageComment = await (model.getTotalPageComment(productID));
        pageComment = pageComment > totalPageComment? totalPageComment: pageComment;
        if(pageComment === 0) pageComment = 1;
        var result = await model.getProductDetail(productID);
        if(result.length === 0){
            return res.render('Home/home',{isLogin: true, title: "Trang chủ"});
        }
        var name = "";
        if(typeof(sess) !== "undefined"){
            name = sess.userName || "";
        }

        // Get product comment
        var comment = await(model.getProductComment(productID,pageComment));

        // Get relative product
        var relativeProduct = await model.getListProduct({
            "producer": result[0].producer
        });

        return res.render('Products/product',{
            isLogin: true,
            title: "Chi tiết sản phẩm",
            product : result[0],
            comment: comment,
            name: name,
            totalPageComment: totalPageComment,
            pageComment: pageComment,
            relativeProduct: relativeProduct,
            total: total,
            count: count
        });
    }

    async postComment(req,res){
        // Get product ID
        var productID = req.params.productID;
        var name = removeScript(req.body.name);
        var comment = removeScript(req.body.comment);
        //Remove script
        await model.addComment(productID,name,comment);

        return res.redirect('/product/'+ productID);
    }

}

function removeScript(str){
    console.log(str);
    str = str.replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi,'');
    return str;
}

module.exports = ProductController;
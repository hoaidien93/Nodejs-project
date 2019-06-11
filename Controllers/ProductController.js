var Model = require('../Model/Model');
var model = new Model();
const PAGE_SIZE = 10;

class ProductController{
    async getProduct(req,res){
        // Get product ID
        var productID = req.params.productID;
        // Get page comment
        var pageComment = req.query.page || 1;
        // Get total page comment
        console.log(productID);
        var totalPageComment = await (model.getTotalPageComment(productID));
        pageComment = pageComment > totalPageComment? totalPageComment: pageComment;
        var result = await model.getProductDetail(productID);
        if(result.length === 0){
            return res.render('Home/home',{isLogin: true, title: "Trang chủ"});
        }
        var sess = req.session;
        var name = "";
        if(typeof(sess) !== "undefined"){
            name = sess.userName || "";
        }

        // Get product comment
        var comment = await(model.getProductComment(productID,pageComment));
        return res.render('Products/product',{
            isLogin: true,
            title: "Chi tiết sản phẩm",
            product : result[0],
            comment: comment,
            name: name,
            totalPageComment: totalPageComment,
            pageComment: pageComment
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
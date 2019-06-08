var Model = require('../Model/Model');
var model = new Model();
const PAGE_SIZE = 10;

class CatergoryController {
    async getCategory(req, res) {
        var sess = req.session;
        var page = req.query.page || 1;
        var total = sess.total || 0;
        total += " VNĐ";
        var count = sess.count || 0;
        // Get Max Page
        var getMaxProducts = await model.getMaxProducts({});
        var maxPage = Math.ceil(getMaxProducts / PAGE_SIZE);
        page = maxPage < page ? maxPage : page;

        var result = await model.getListProduct({},page);
        return res.render('Category/category', {
            isLogin: true,
            title: "Danh sách sản phẩm",
            products: result,
            page: page,
            maxPage: maxPage,
            total: total,
            count: count
        });
    }
}

module.exports = CatergoryController;
var Model = require('../Model/Model');
var model = new Model();
const PAGE_SIZE = 10;

class CatergoryController {
    async getCategory(req, res) {
        var page = req.query.page || 1;

        // Get Max Page
        var getMaxProducts = await model.getMaxProducts({});
        var maxPage = Math.ceil(getMaxProducts / PAGE_SIZE);
        page = maxPage < page ? maxPage : page;

        var result = await model.getListProduct({},page);
        return res.render('Category/category', { isLogin: true, title: "Danh sách sản phẩm", products: result, page: page, maxPage: maxPage});
    }
}

module.exports = CatergoryController;
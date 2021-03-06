var Model = require('../Model/Model');
var model = new Model();
const PAGE_SIZE = 10;

class CatergoryController {
    async getCategory(req, res) {
        var sess = req.session;
        var page = req.query.page || 1;
        var total = sess.total || 0;
        total = total.toString().replace(/(.)(?=(\d{3})+$)/g,'$1.')
        total += " VNĐ";
        var logged = true;
        if(typeof(sess.email) === "undefined"){
            logged = false;
        }
        var count = sess.count || 0;
        var XuatXu = req.query.XuatXu || "";
        var NhaSanXuat = req.query.NhaSanXuat || "";
        var query = {};
        if (XuatXu) {
            query.country = XuatXu;
        }
        if (NhaSanXuat) {
            query.producer = NhaSanXuat;
        }
        // Get Max Page
        var getMaxProducts = await model.getMaxProducts(query);
        var maxPage = Math.ceil(getMaxProducts / PAGE_SIZE);
        page = maxPage < page ? maxPage : page;
        if(page === 0) page = 1;
        // Get option Xuat Xu
        var optionXuatXu = await model.getOptionXuatXu();
        var optionNhaSanXuat = await model.getOptionNhaSanXuat();
        var result = await model.getListProduct(query,page);

        return res.render('Category/category', {
            isLogin: true,
            title: "Danh sách sản phẩm",
            products: result,
            page: page,
            maxPage: maxPage,
            total: total,
            count: count,
            optionNhaSanXuat : optionNhaSanXuat,
            optionXuatXu: optionXuatXu,
            XuatXu: XuatXu,
            NhaSanXuat: NhaSanXuat,
            logged: logged
        });
    }
}

module.exports = CatergoryController;
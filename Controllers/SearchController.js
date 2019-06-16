var Model = require("../Model/Model");
var model = new Model();
class SearchController{
    
    async getSearch(req,res){
        var sess = req.session;
        var page = req.query.page || 1;
        var total = sess.total || 0;
        total = total.toString().replace(/(.)(?=(\d{3})+$)/g,'$1.')
        total += " VNĐ";
        var count = sess.count || 0;
        // Get option Xuat Xu
        var optionXuatXu = await model.getOptionXuatXu();
        var optionNhaSanXuat = await model.getOptionNhaSanXuat();
        var XuatXu = req.query.XuatXu || "";
        var NhaSanXuat = req.query.NhaSanXuat || "";
        var TuKhoa = req.query.TuKhoa || "";
        var page = req.query.page || 1;
        var maxPage = await model.getMaxPageSearch(XuatXu,NhaSanXuat,TuKhoa);
        page = page > maxPage ? maxPage : page;

        var result = [];
        if(maxPage != 0){
            result = await model.getProductSearch(XuatXu,NhaSanXuat,TuKhoa,page);
        }
        // Get new product
        var newProducts = await model.getNewProduct(5);
        
        return res.render('Search/search',{
            total: total,
            count: count,
            optionXuatXu: optionXuatXu,
            optionNhaSanXuat: optionNhaSanXuat,
            XuatXu: XuatXu,
            NhaSanXuat: NhaSanXuat,
            TuKhoa: TuKhoa,
            isLogin: true,
            title: "Tìm kiếm",
            result: result,
            page: page,
            maxPage: maxPage,
            newProducts: newProducts
        });
    }
}

module.exports = SearchController;
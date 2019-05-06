class SearchController{
    getSearch(req,res){
        return res.render('Search/search',{isLogin: true, title: "Tìm kiếm"});
    }
}

module.exports = SearchController;
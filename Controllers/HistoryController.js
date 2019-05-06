class HistoryController{
    getHistory(req,res){
        return res.render('History/history',{isLogin: true, title: "Lịch sử"});
    }
}

module.exports = HistoryController;
class CheckOutController{
    getCheckOut(req,res){
        return   res.render('CheckOut/checkout',{isLogin: true, title: "Thanh toán"});
    }
}

module.exports = CheckOutController;
var MongoClient = require('mongodb').MongoClient;
var url = "mongodb://hoaidien:hoaidien0510@ds155606.mlab.com:55606/nodejs";
var dbo;
const PAGE_SIZE = 10;
var crypto = require("crypto");
class Model {
    constructor() {
        //Connect dtb:
        MongoClient.connect(url, { useNewUrlParser: true }, (err, db) => {
            if (err) throw err;
            dbo = db.db("nodejs");
        });
    }

    async getListProduct(condition, page) {
        var result = await dbo.collection("Products")
            .find(condition)
            .skip(PAGE_SIZE * (page - 1))
            .limit(PAGE_SIZE).toArray();
        return result;
    }

    async getProductDetail(productID) {
        var query = { "productID": productID };
        var result = await dbo.collection("Products").find(query).toArray();
        return result;
    }

    async getNewProduct(limit) {
        // Get 10 newest product
        var result = await dbo.collection("Products")
            .find({})
            .sort({ dateUpdate: -1 })
            .limit(limit)
            .toArray();
        return result;
    }

    async getBestSelling(limit) {
        // Get 3 best selling
        var result = await dbo.collection("Products")
            .find({})
            .sort({ quantitySold: -1 })
            .limit(limit)
            .toArray();
        return result;
    }

    async createAccount(account) {
        var queryCheck = {
            "email": account.email
        }
        // Check email is exists
        var isExists = await dbo.collection("Users").find(queryCheck).toArray();
        if (isExists.length === 0) {
            var result = await dbo.collection("Users").insertOne(account);
            return result.insertedCount > 0;
        }
        return false;
    }

    async getAccount(account) {
        var result = await dbo.collection("Users").find(account).toArray();
        return result;
    }

    async updateInfo(email, newInfo) {
        var query = {
            "email": email
        }
        var result = await dbo.collection("Users").update(query, { $set: newInfo });
        return result;
    }

    async getMaxProducts(condition) {
        var result = await dbo.collection("Products").find(condition).count();
        return result;
    }

    async getProduct(productID) {
        var query = {
            productID: productID
        }
        var result = await dbo.collection("Products").find(query).toArray();
        return result;
    }

    async addComment(productID, name, comment) {
        //Get Date
        var date = Date.now();
        // format H:i:s d/m/Y
        var query = {
            productID: productID,
            name: name,
            comment: comment,
            dateComment: date
        }
        var result = await dbo.collection("ProductComment").insertOne(query);
        return result;
    }

    async getTotalPageComment(productID) {
        var query = {
            productID: productID
        }
        var result = await dbo.collection("ProductComment").find(query).count();
        var totalPage = Math.ceil(result / PAGE_SIZE);
        return totalPage;
    }

    async getProductComment(productID, pageComment) {
        var query = {
            productID: productID
        }
        var result = await dbo.collection("ProductComment")
            .find(query)
            .sort({ dateComment: -1 })
            .skip(PAGE_SIZE * (pageComment - 1))
            .limit(PAGE_SIZE)
            .toArray();
        result.forEach((element) => {
            var dateComment = new Date(element.dateComment);
            var time = dateComment.getHours() + ":" + dateComment.getMinutes() + ":" + dateComment.getSeconds();
            var date = dateComment.getDate() + '/' + (dateComment.getMonth() + 1) + '/' + dateComment.getFullYear();
            element.dateTime = time + " " + date;
        })

        return result;
    }
    async getMaxPageSearch(XuatXu, NhaSanXuat, TuKhoa) {
        var query = {};
        if (XuatXu) {
            query.country = XuatXu;
        }
        if (NhaSanXuat) {
            query.producer = NhaSanXuat;
        }
        if (TuKhoa) {
            query.name = {
                $regex: ".*" + TuKhoa + ".*"
            }
        }
        var result = await dbo.collection("Products").find(query).count();
        console.log(result);
        console.log(query);
        var maxPage = Math.ceil(result / PAGE_SIZE);
        return maxPage;
    }

    async getProductSearch(XuatXu, NhaSanXuat, TuKhoa, page) {
        var query = {};
        if (XuatXu) {
            query.country = XuatXu;
        }
        if (NhaSanXuat) {
            query.producer = NhaSanXuat;
        }
        if (TuKhoa) {
            query.name = {
                $regex: ".*" + TuKhoa + ".*"
            }
        }
        var result = await dbo.collection("Products").find(query).skip((page - 1) * PAGE_SIZE).limit(PAGE_SIZE).toArray();
        return result;
    }

    async getOptionXuatXu(){
        var result = await dbo.collection("Products").distinct("country");
        return result;
    }

    async getOptionNhaSanXuat(){
        var result = await dbo.collection("Products").distinct("producer");
        return result;
    }

    async activeAccount(email,token){
        var query = {
            "email": email,
            "token": token
        }
        var checkExists = await dbo.collection("Users").find(query).toArray();
        if(checkExists.length === 0) return "";
        // Actice account
        var query = {
            "email": email
        }
        // Change token
        var newToken = crypto.randomBytes(20).toString('hex');

        var newInfo = {
            "active": "1",
            "token": newToken
        }
        await dbo.collection("Users").updateOne(query, { $set: newInfo });

        // Return username
        return checkExists[0].userName;
    }

    updateToken(email,token){
        var query = {
            "email": email
        }
        var newToken = {
            "token": token
        }
        dbo.collection("Users").updateOne(query, { $set: newToken });
        return true;
    }

    async checkToken(email,token){
        var query = {
            "email": email,
            "token": token
        }
        var checkExists = await dbo.collection("Users").find(query).count();
        if(checkExists) return true;
        return false;
    }

    updatePassword(email,password){
        var query = {
            "email": email
        }
        // Change token
        var newToken = crypto.randomBytes(20).toString('hex');
        var newInfo = {
            "password": password,
            "token": newToken
        }
        
        dbo.collection("Users").updateOne(query, { $set: newInfo });
        return true;
    }

    updateHistory(email,total){
        var today = Date.now();
        var query = {
            "email": email,
            "date": today,
            "status": "Đã xác nhận",
            "total": total
        }
        dbo.collection("History").insertOne(query);
    }

    async getHistory(email){
        var query = {
            "email" : email
        }

        var result = await dbo.collection("History").find(query).toArray();

        return result;
    }
}

module.exports = Model;
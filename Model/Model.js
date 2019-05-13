var MongoClient = require('mongodb').MongoClient;
var url = "mongodb://hoaidien:hoaidien0510@ds155606.mlab.com:55606/nodejs";
var dbo;

class Model{
    constructor(){
         //Connect dtb:
         MongoClient.connect(url,{useNewUrlParser: true },(err,db)=> {
            if (err) throw  err;
            dbo = db.db("nodejs");
        });
    }

    async getListProduct(condition){
        var result = await dbo.collection("Products").find(condition).toArray();
        return result;
    }

    async getProductDetail(productID){
        var query = {"productID": productID};
        var result = await dbo.collection("Products").find(query).toArray();
        return result;
    }

    async getNewProduct(){
        // Get 10 newest product
        var result = await dbo.collection("Products").find({}).sort( { dateUpdate: -1 } ).limit(10).toArray();
        return result;
    }

    async getBestSelling(){
        // Get 3 best selling
        var result = await dbo.collection("Products").find({}).sort( { quantitySold: -1 } ).limit(3).toArray();
        return result;
    }

}

module.exports = Model;

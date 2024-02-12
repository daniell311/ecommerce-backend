import queryHelper from "../utils/queryHelper.js";

class ProductController{
    async addProduct(req,res){
        try {
            const { productName, productDetails, productPrice } = req.body;
            if(!productName) { throw { code : 404, message : 'Product Name is Required'}};
            if(!productDetails) { throw { code : 404, message : 'Product Details is Required'}};
            if(!productPrice) { throw { code : 404, message : 'Product Price is Required'}};

            const data = {
                productname : productName,
                productdetails : productDetails,
                productprice : productPrice,
                storeid: 1,
                softdelete: 0
            };
            console.log({ sess : JSON.stringify(req.headers.authorization)});
            const result = await queryHelper.insertData("product", "p_product", data);
            if(result.rowCount){
                return res.status(200)
                            .json({
                                status: true,
                                message : "Berhasil Menambah Product",
                                productName : productName,
                                productPrice : productPrice,
                            })
            }else{
                throw { 
                    code : 404, 
                    message : 'Gagal Menambah Product'
                } 
            }
        } catch (error) {
            return res.status(error.code || 500)
                .json({
                    status: false,
                    message: error.message
                });
        }
    }
}

export default new ProductController();
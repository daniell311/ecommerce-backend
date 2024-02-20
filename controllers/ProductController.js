import queryHelper from "../utils/queryHelper.js";
import { response, responsePaginate, responseError } from "../utils/response.js";

class ProductController{
    async getAllProduct(req, res) {
        try {
            const page = req.query.page ? req.query.page : 1;
            const limit = req.query.limit ? req.query.limit : 10;
            const offset = (parseInt(page) - 1) * limit;

            const sumData = await queryHelper.countRow('product', 'p_product', 'productid');
            const data = await queryHelper.getData('product', 'p_product', limit, offset);

            if(data){
                return responsePaginate(200, data.rows, "Get All Product", sumData[0].count, limit, page, res);
            }else{
                throw{
                    code : 404,
                    message : "Data Not Found"
                }
            }
        } catch (error) {
            return responseError(error.code, error.message);
        }
    }

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
            console.log({ sess : req.jsonwebtoken.username});
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

    // TODO add form validation logic
    async editProduct(req, res){
        try {
            const { productName, productDetails, productPrice } = req.body;
            const productId = req.params.productid;
            if(!productName) { throw { code : 404, message : 'Product Name is Required'}};
            if(!productDetails) { throw { code : 404, message : 'Product Details is Required'}};
            if(!productPrice) { throw { code : 404, message : 'Product Price is Required'}};

            const product = await queryHelper.getRow('product', 'p_product', `productid = ${ productId }`);
            const data = req.body;
            const result = await queryHelper.updateData('product', 'p_product', data, ` productid = ${ productId }`);
            if(result){
                return res.status(200)
                            .json({
                                status: true,
                                message : "Berhasil Mengedit Product",
                                productName : productName,
                            })
            }else{
                throw { 
                    code : 404, 
                    message : 'Gagal Mengedit Product'
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

    async deleteProduct(req, res){
        try {
            const productId = req.params.productid;
            const productName = await queryHelper.findOne('product', 'p_product', 'productname', `productid = ${productId}`)
            const result = await queryHelper.deleteData('product', 'p_product', `productid = ${productId}`);
            if(result){
                return res.status(200)
                            .json({
                                status: true,
                                message : "Berhasil Menghapus Product",
                                productName : productName[0],
                            })
            }else{
                throw { 
                    code : 404, 
                    message : 'Gagal Menghapus Product'
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
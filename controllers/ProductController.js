import productModel from "../models/ProductModel.js";
import queryHelper from "../utils/queryHelper.js";
import { response, responsePaginate, responseError } from "../utils/response.js";
import { tableAttr } from "../models/ProductModel.js";

class ProductController{
    async getAllProduct(req, res) {
        try {
            const sumData = await queryHelper.countRow(tableAttr.schemaTable, 'productid');
            const data = await queryHelper.getData(tableAttr.schemaTable, req.paginateLimit, req.paginateOffset);
            if(data){
                return responsePaginate(200, data.rows, "Get All Product", sumData[0].count, req.paginateLimit, req.paginatePage, res);
            }else{
                responseError(404, "Data Not Found", res);
            }
        } catch (error) {
            return responseError(error.code, error.message, res);
        }
    }

    async getProductById(req, res) {
        try {
            const productId = req.params.productid;
            if(!productId) { return responseError(404, "Product Id Required", res); }
            const data = await queryHelper.getRow(tableAttr.schemaTable, ` productid = ${ productId }`);
            if(data != undefined){
                return response(200, data, "Get Product By Id", res, data.rowCount)
            }else{
                return responseError(404, "Data Not Found By Id " + productId, res);
            }
        } catch (error) {
            return responseError(error.code, error.message, res);
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
            const result = await queryHelper.insertData(tableAttr.schemaTable, data);
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

    async editProduct(req, res){
        try {
            const { productName, productDetails, productPrice } = req.body;
            const productId = req.params.productid;
            if(!productName) { throw { code : 404, message : 'Product Name is Required'}};
            if(!productDetails) { throw { code : 404, message : 'Product Details is Required'}};
            if(!productPrice) { throw { code : 404, message : 'Product Price is Required'}};

            const data = req.body;
            const result = await queryHelper.updateData(tableAttr.schemaTable, data, productId , req);
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
            const productName = await queryHelper.findOne(tableAttr.schemaTable, 'productname', `productid = ${productId}`)
            const result = await queryHelper.deleteData(tableAttr.schemaTable, `productid = ${productId}`);
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
import queryHelper from "../utils/queryHelper.js";
import { response, responsePaginate, responseError } from "../utils/response.js";

class StoreController {
    async createStore(req, res){
        try {
            const { storeName, storeDescription, noHp, address, storeLink} = req.body;
    
            if(!storeName) { return responseError(404, "Store Name is required!", res ) };
            if(!storeDescription) { return responseError(404, "Store Description is required!", res ) };
            
            const isStoreNameExist = await queryHelper.isExist('store', 'st_store', 'storename', ` storename = '${ storeName }'`);
            if(isStoreNameExist) { return responseError(404, "Store Name already Exist!", res ) };
            const data = {
                storename : storeName,
                userid : req.jsonwebtoken.userid,
                storedescription : storeDescription,
                nohp : noHp,
                address : address,
                storelink : storeLink
            };
            const result = await queryHelper.insertData('store', 'st_store', data);
            if(result){
                return response(200, data, "Successfully created Store", res, result.rowCount)
            }else{
                return responseError(404, "Failed create store", res);
            }

        } catch (error) {
            return responseError(error.code, error.message, res);
        }
    }
}

export default new StoreController();
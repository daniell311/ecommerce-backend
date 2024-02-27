import queryHelper from "../utils/queryHelper.js";
import { response, responsePaginate, responseError } from "../utils/response.js";
import { regexEmailValidator } from "../utils/emailValidator.js";
import { tableAttr } from "../models/StoreModel.js";

class StoreController {
    async createStore(req, res){
        try {
            const { storeName, storeDescription, phone, address, storeLink, email} = req.body;
    
            if(!storeName) { return responseError(404, "Store Name is required!", res ) };
            if(!storeDescription) { return responseError(404, "Store Description is required!", res ) };
            if(!regexEmailValidator(email)) { return responseError(404, "Emaill is not Valid", res ) };

            const isStoreNameExist = await queryHelper.isExist(tableAttr.schemaTable, 'storename', ` storename = '${ storeName }'`);
            const isPhoneExist = await queryHelper.isExist(tableAttr.schemaTable, 'phone', ` phone = '${ phone }'`);
            const isEmailExist = await queryHelper.isExist(tableAttr.schemaTable, 'email', ` email = '${ email }'`);
            
            if(isStoreNameExist) { return responseError(404, "Store Name already Exist!", res ) };
            if(isPhoneExist) { return responseError(404, "Phone Number already used!", res ) }; 
            if(isEmailExist) { return responseError(404, "Email already used!", res ) }; 
            
            const data = {
                storename : storeName,
                userid : req.jsonwebtoken.userid,
                storedescription : storeDescription,
                phone : phone,
                address : address,
                storelink : storeLink,
                email : email
            };
            const result = await queryHelper.insertData(tableAttr.schemaTable, data);
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
import bcrypt from "bcrypt";
import dotenv from "dotenv";
import jwt from "jsonwebtoken";
import regexEmailValidator from "../utils/regexEmailValidator.js";
import { generateAccessToken, generateRefreshToken } from "../utils/generateToken.js";
import authModel from "../models/AuthModel.js";

const env = dotenv.config().parsed; 

class AuthController{

    async registration(req, res){
        try {
            const { username, fullName, email, password} = req.body;
            if(!username) { throw { code : 404, message : 'Username is Required '} };
            if(!fullName) { throw { code : 404, message : 'Full name is Required '} };
            if(!email) { throw { code : 404, message : 'Email is Required '} };
            if(!password) { throw { code : 404, message : 'Password is Required '} };
            if(!regexEmailValidator(email)) { throw { code : 404, message : 'Emaill is not Vaid' }};
            
            const salt = await bcrypt.genSalt(15);
            const hash = await bcrypt.hash(password, salt);
            const data = {
                username: username,
                fullname : fullName,
                email: email,
                password : hash,
                roleid: 1,
                softdelete: 0,
                isAktif : 1,
                salt : salt,
            }
            const result = await authModel.createUser(data);
            if(result.rowCount){
                return res.status(200)
                            .json({
                                status: true,
                                message : "REGISTER SUCCESS",
                                fullName : fullName,
                            })
            }else{
                throw { 
                    code : 404, 
                    message : 'Gagal Melakukan Registrasi'
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

export default new AuthController();
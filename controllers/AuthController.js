import bcrypt from "bcrypt";
import { regexEmailValidator } from "../utils/emailValidator.js";
import { generateAccessToken, generateRefreshToken } from "../utils/generateToken.js";
import authModel from "../models/AuthModel.js";
import queryHelper from "../utils/queryHelper.js";
import dotenv from "dotenv";
import jwt from "jsonwebtoken";
import { tableAttr } from "../models/AuthModel.js";

const env = dotenv.config().parsed;

class AuthController{

    async registration(req, res){
        try {
            const { username, fullName, email, password} = req.body;
            if(!username) { throw { code : 404, message : 'Username is Required '} };
            if(!fullName) { throw { code : 404, message : 'Full name is Required '} };
            if(!email) { throw { code : 404, message : 'Email is Required '} };
            if(!password) { throw { code : 404, message : 'Password is Required '} };
            if(!regexEmailValidator(email)) { throw { code : 404, message : 'Emaill is not Valid' }};

            const emailExist = await queryHelper.isExist(tableAttr.schemaTable, 'email', `email = '${email}'`);
            if(emailExist) { throw { code : 404, message : 'Email Already Exist' } };
            const usernameExist = await queryHelper.isExist(tableAttr.schemaTable, 'username', `username = '${username}'`);
            if(usernameExist) { throw { code : 404, message : 'Username Already Exist' } };

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
            const result = await queryHelper.insertData(tableAttr.schemaTable, data);
            if(result.rowCount){
                const userId = await queryHelper.findOne(tableAttr.schemaTable, 'userid', ` username = '${ username }'`);
                // payload user data used as a session when user login
                let payload = { 
                    userid: userId, 
                    username : username
                }
                const accessToken = await generateAccessToken(payload);
                const refrestToken = await generateRefreshToken(payload);
                return res.status(200)
                            .json({
                                status: true,
                                message : "REGISTER SUCCESS",
                                fullName : fullName,
                                accessToken : accessToken,
                                refrestToken : refrestToken
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
    
    async login(req,res) {
        try{
            const { username, password } = req.body;
            if(!username) { throw { code : 400, message : "Please enter a Username" } }
            if(!password) { throw { code : 400, message : "Please enter a Password" } }

            const user = await queryHelper.getRow(tableAttr.schemaTable, `username = '${username}'`)
            if( user == undefined) { throw { code :404, message: "USER NOT FOUND" } }
            const isPasswordValid = await bcrypt.compareSync(password, user.password)
            if(!isPasswordValid) { throw { code :404, message: "INVALID PASSWORD"}}

            // payload user data used as a session when user login
            let payload = { 
                userid: user.userid,
                username : user.username
            }
            const accessToken = await generateAccessToken(payload)
            const refreshToken = await generateRefreshToken(payload)
            
            return res.status(200)
                        .json({ 
                            status: true,
                            message: "LOGIN SUCCESSFUL",
                            fullname : user.fullname,
                            accessToken,
                            refreshToken
                        })
        } catch(error){
            return res.status(error.code || 500)
                        .json({
                            status : false,
                            message: error.message
                        })
        }
    }

    async refreshToken(req, res){
        try{
            const token = req.body.refreshToken;
            if(!token) { throw { code:400, message: 'Refresh token is Required' } }

            // Verify refresh token validity
            const verify = await jwt.verify(token, env.REFRESH_TOKEN);
            let payload = { 
                userid: verify.userid, 
                username: verify.username
            }
            const accessToken = await generateAccessToken(payload)
            const refreshToken = await generateRefreshToken(payload)

            return res.status(200)
                        .json({
                            status : true,
                            message : 'Refresh token Success',
                            accessToken,
                            refreshToken
                        })
        }catch(error){
            // Catch error message from method .verify
            const jwtError = ['invalid signature', 'jwt must be provided', 'jwt malformed', 'invalid token'];

            if(error.message == 'jwt expired'){
                error.message = 'Refresh token expired'
            }else if(jwtError.includes(error.message)){
                        error.message = 'Refresh Token Invalid'
            } 
            // 
            return res.status(error.code || 500)
                        .json({
                                status : false,
                                message: error.message
                            })
        }
    }
}

export default new AuthController();
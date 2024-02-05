import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';

const env = dotenv.config().parsed;

// Middlewares function to filter request first before sending it to controller
const jwtAuth = () => {
    return async (req, res, next) => {
        try{
            if(!req.headers.authorization) { throw { code: 401, message: "UNAUTHORIZED" } }

            const token = req.headers.authorization.split(' ')[1]
            const verify = jwt.verify(token, env.ACCESS_TOKEN)
            req.jsonwebtoken = verify // this request needed for bringing user data authentication (ex. id), its like session

            next() // Continue to next middleware / controller 
        }catch(error){
            // Catch error message from method .verify
            const jwtError = ['invalid signature', 'jwt must be provided', 'jwt malformed', 'invalid token'];

            if(error.message == 'jwt expired'){
                error.code = 401
                error.message = 'Access token expired'
            }else if(jwtError.includes(error.message)){
                        error.message = 'Access Token Invalid'
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

export default jwtAuth
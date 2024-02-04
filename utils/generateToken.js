import dotenv from 'dotenv';
import jwt from "jsonwebtoken";

const env = dotenv.config().parsed

export const generateAccessToken = async (payload) => {
    return jwt.sign(payload,
        env.ACCESS_TOKEN,
        { expiresIn : env.ACCESS_TOKEN_EXPIRATION }
        )
}

export const generateRefreshToken = async (payload) => {
    return jwt.sign(payload,
        env.REFRESH_TOKEN,
        { expiresIn : env.REFRESH_TOKEN_EXPIRATION }
        )
}
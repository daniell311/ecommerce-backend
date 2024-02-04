import db from '../database/connection.js';

export const regexEmailValidator = (email) => {
    return /[a-z0-9]+@[a-z]+\.[a-z]{2,3}/.test(email)
}

export const isEmailExist = async(email) => {
    try {
        const sql = `select email from auth.a_users where email = '${ email }' `;
        const myPromise = () => {
            return new Promise((resolve, reject) => {
                db.query(sql, (err, fields) => {
                    err 
                    ? reject(err) 
                    : resolve(fields.rowCount != 0 ? true : false);
                });
            });
        }; 
        let result = await(myPromise());
        return result;
    } catch (error) {
        return error;
    }
}
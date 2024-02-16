import db from '../database/connection.js';
import dotenv from "dotenv";

const env = dotenv.config().parsed;
class queryHelper {
    async insertData(schema, table, data){
        try {
            let cols = [];
            let values = [];
            for (let key in data) {
                cols.push(key);
                if(typeof data[key] === 'string'){
                    values.push(`'${data[key]}'`);
                }else if(typeof data[key] === "number"){
                    values.push(data[key]);
                }
            }
            const sql = `INSERT INTO ${schema}.${table} (${cols}) VALUES (${values})`;
            const myPromise = () => {
                return new Promise((resolve, reject) => {
                    db.query(sql, (err, fields) => {
                        err 
                        ? reject(err) 
                        : resolve(fields);
                    });
                });
            }; 
            let result = await(myPromise());
            return result;
        } catch (error) {
            return error
        }
    }
    async updateData(schema, table, data, keys){
        try {
            let values = [];
            let timestamp = new Date().toLocaleString('en-US', { timeZone: env.TIMEZONE });
            values.push(`updatedat = '${timestamp}'`);
            for (let key in data) {
                if(typeof data[key] === 'string'){
                    values.push(key + "=" + `'${data[key]}'`);
                }else if(typeof data[key] === "number"){
                    values.push(key + "=" + data[key]);
                }
            }
            const sql = `UPDATE ${schema}.${table} set ${ values } WHERE ${ keys }`;
            const myPromise = () => {
                return new Promise((resolve, reject) => {
                    db.query(sql, (err, fields) => {
                        err 
                        ? reject(err) 
                        : resolve(fields);
                    });
                });
            }; 
            let result = await(myPromise());
            return result;
        } catch (error) {
            return error;
        }
    }

    async deleteData(schema, table, condition){
        try {
            const sql = `DELETE FROM ${schema}.${table} WHERE ${ condition }`;
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

    async findOne(schema, table, col, condition){
        try {
            const sql = `SELECT ${ col } FROM ${ schema }.${ table } WHERE ${ condition }`
            const myPromise = () => {
                return new Promise((resolve, reject) => {
                    db.query(sql, (err, fields) => {
                        err 
                        ? reject(err) 
                        : resolve(fields.rows);
                    });
                });
            }; 
            let result = await(myPromise());
            return result;
            
        } catch (error) {
            return error;
        }
    } 

    async getRow(schema, table, condition){
        try {
            const sql = `SELECT * FROM ${ schema }.${ table } WHERE ${ condition }`
            const myPromise = () => {
                return new Promise((resolve, reject) => {
                    db.query(sql, (err, fields) => {
                        err 
                        ? reject(err) 
                        : resolve(fields.rows);
                    });
                });
            }; 
            let result = await(myPromise());
            return result;
            
        } catch (error) {
            return error;
        }
    }

    async isExist(schema, table, col, condition){
        try {
            const sql = `SELECT ${ col } FROM ${ schema }.${ table } WHERE ${ condition } `;
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

}

export default new queryHelper();
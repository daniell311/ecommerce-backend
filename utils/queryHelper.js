import db from '../database/connection.js';
import dotenv from "dotenv";

const env = dotenv.config().parsed;

// Get table key
const getTableKey = async tableName => {
    const sql = `SELECT c.column_name, c.data_type
    FROM information_schema.table_constraints tc 
    JOIN information_schema.constraint_column_usage AS ccu USING (constraint_schema, constraint_name) 
    JOIN information_schema.columns AS c ON c.table_schema = tc.constraint_schema
    AND tc.table_name = c.table_name AND ccu.column_name = c.column_name
    WHERE constraint_type = 'PRIMARY KEY' and tc.table_name = '${ tableName }';`
    const myPromise = () => {
        return new Promise((resolve, reject) => {
            db.query(sql, (err, fields) => {
                err ? reject(err) : resolve(fields.rows);
            })
        })
    }
    const rows = await(myPromise());
    const keys = [];
    for (let key in rows) {
        keys.push(rows[key].column_name);
    }  

    return keys;
}

class queryHelper {
    // Get data by defined query
    async getBySQL(query){
        try {
            const myPromise = () => {
                return new Promise((resolve, reject) => {
                    db.query(query, (err, fields) => {
                        err ? reject(err) : resolve(fields);
                    })
                })
            }
            let result = await(myPromise());
            return result;
        } catch (error) {
            return error;
        }
    }

    async getData(schema, table, limit, offset){
        try {
            let sql = `SELECT * FROM ${ schema }.${ table }`;
            if(limit != null) { sql += ` LIMIT ${ limit }` };
            if(offset != null) { sql += ` OFFSET ${ offset }` }; 

            const myPromise = () => {
                return new Promise((resolve, reject) => {
                    db.query(sql, (err, fields) => {
                        err ? reject(err) : resolve(fields);
                    })
                })
            }
            let result = await(myPromise());
            return result;
        } catch (error) {
            return error;
        }
    }

    async countRow(schema, table, col, condition){
        try {
            let sql = `SELECT COUNT(${ col }) FROM ${ schema }.${ table }`;
            if(condition) sql += ` WHERE ${ condition }`;
            
            const myPromise = () => {
                return new Promise((resolve, reject) => {
                    db.query(sql, (err, fields) => {
                    err ? reject(err) : resolve(fields.rows)
                    });
                });
            };
            let result = await (myPromise());
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
                        // Get first row, first row = array index[0]
                        : resolve(fields.rows[0]);
                    });
                });
            }; 
            let result = await(myPromise());
            return result;
            
        } catch (error) {
            return error;
        }
    }

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

    // TODO handle if table keys have > 1 
    // TODO Handle get user username for every update rows, if possible don't use req
    async updateData(schema, table, data, keys, req){
        try {
            const tableKey = await getTableKey(table);
            const userName = req.jsonwebtoken.username;

            let values = [];
            let timestamp = new Date().toLocaleString('en-US', { timeZone: env.TIMEZONE });
            values.push(`updatedat = '${ timestamp }'`);
            values.push(`updatedby = '${ userName }'`)
            for (let key in data) {
                if(typeof data[key] === 'string'){
                    values.push(key + "=" + `'${data[key]}'`);
                }else if(typeof data[key] === "number"){
                    values.push(key + "=" + data[key]);
                }
            }
            const sql = `UPDATE ${schema}.${table} set ${ values } WHERE ${ tableKey[0] } = ${ keys }`;
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
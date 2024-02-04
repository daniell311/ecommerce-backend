import db from '../database/connection.js';

class AuthModel{
    async isEmailExist(){
        try {
            const sql = `select email from users where email = ${ email } `;
            const myPromise = () => {
                return new Promise((resolve, reject) => {
                    db.query(sql, (err, fields) => {
                        err ? reject(err) : resolve(fields.rows);
                    });
                });
            }; 
            let result = await(myPromise());
            return result;
        } catch (error) {
            return error;
        }
    }

    async createUser(data){
        try {
            const sql = `INSERT INTO auth.a_users (username, fullname, email, password, roleid, softdelete, isAktif, salt) VALUES ('${data.username}', '${data.fullname}', '${data.email}', '${data.password}', '${data.roleid}', '${data.softdelete}', '${data.isAktif}', '${data.salt}')`;
            let myPromise = () => {
                return new Promise((resolve, reject) => {
                    db.query(sql, (err, fields) => {
                        err ? reject(err) : resolve(fields);
                        console.log({fi : fields});
                    })
                });
            }
            let result = await (myPromise());
            return result;
        } catch (error) {
            return error;
        }
    }
}

export default new AuthModel();
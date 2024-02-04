import db from '../database/connection.js';

// TODO create utils for insert data into database
export const insertData = data => {
    for (let key in data) {
        console.log('key', key);
        console.log('value', data[key]);
}
};
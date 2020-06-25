const mysql = require('mysql2');
const DB_HOST = process.env.DB_HOST;
const DB_USER = process.env.DB_USER;
const DB_PASSWORD = process.env.DB_PASSWORD;
const DB_SCHEMA = process.env.DB_SCHEMA;
const TABLE_NAME = process.env.TABLE_NAME;

class Database {
    constructor() {
        this.connection = mysql.createConnection({
            host: DB_HOST,
            user: DB_USER,
            password: DB_PASSWORD,
            database: DB_SCHEMA
        });
    }

    bulkInsertScoreCardValues(dataArray) {
        let columns = `(${Object.keys(dataArray[0]).join(',')})`;
        let valueStrings = [];
        let valueParams = [];
        
        dataArray.forEach(data => {
            valueStrings.push(`(${'?,'.repeat(Object.values(data).length - 1)}?)`);
            valueParams.push(Object.values(data));
        })

        let valuesString = valueStrings.join(',')
        let valueParameters = [].concat(...valueParams);

        this.connection.query(`INSERT INTO ${TABLE_NAME} ${columns} VALUES ${valuesString}`, valueParameters, (err) => {
            console.log(err);
            process.exit(err ? -1 : 0)
        })
    }
}

module.exports = Database;
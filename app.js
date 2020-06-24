const HttpRequests = require('./classes/httpRequest');
const request = new HttpRequests();
const Database = require('./classes/db');
const database = new Database();

async function start() {
    let totalPages = await request.getTotalPages();

    Promise.all(request.getAllScoolData(totalPages)).then(schoolData => {
        let flat = [].concat(...schoolData);
        database.bulkInsertScoreCardValues(flat);
    }).catch(err => {
        console.error(err);
        process.exit(-1);
    })
}

start();
const API_KEY = process.env.API_KEY;
const axios = require('axios');
const fieldNames = require('../utils/fieldList').join(',')
const promiseLimit = require('promise-limit');
const pLimit = promiseLimit(5);
const responseToDBJson = require('../utils/transformData').responseToDBJson

axios.defaults.baseURL = `https://api.data.gov/ed/collegescorecard/v1/schools.json?school.operating=1&api_key=${API_KEY}`

const RESULTS_PER_PAGE = 25;

class HttpRequests {
    getTotalPages() {
        return axios({
            params: {
               fields: 'school.name',
               per_page: 1
            }
        }).then(response => {
            return Math.ceil(response.data.metadata.total/RESULTS_PER_PAGE)
        }).catch(err => {
            console.error(err);
        })
        ;
    }

    getAllScoolData(totalPages) {
        let pageArray = [...Array(totalPages).keys()]
        
        return pageArray.map(page => {
            return pLimit(() => this._getSchoolData(page));
        })
    }

    _getSchoolData(page) {
        return axios({
            params: {
                fields: fieldNames,
                per_page: RESULTS_PER_PAGE,
                page: page,
                keys_nested: true
             } 
        }).then(response => {
            return responseToDBJson(response.data.results);
        }).catch(err => {
            new Error(err);
        });
    }
}

module.exports = HttpRequests
const businessLogic = require('../businessLogic/index');

class ApiWrapper {
    constructor() {}

    async create(call, callback){
        try {
            const result = await businessLogic.create(call.request);
            callback(undefined, result);
        } catch (error) {
            callback({error: error.message});
        }
    } 
    async login(call, callback){
        try {
            const result = await businessLogic.login(call.request);
            callback(undefined, result);
        } catch (error) {
            callback({error: error.message});
        }
    }
    async getAll(call, callback){
        try {
            const result = await businessLogic.getAll(call.request);
            callback(undefined, { users: result });
        } catch (error) {
            callback({error: error.message});
        }
    }
    async getOne(call, callback){
        try {
            const result = await businessLogic.getOne(call.request);
            callback(undefined, result);
        } catch (error) {
            callback({error: error.message});
        }
    } 

}

module.exports = ApiWrapper;
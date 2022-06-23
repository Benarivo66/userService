const businessLogic = require('../businessLogic/index');
const GrpcHelper = require('service-specs').GrpcHelper;
const { authenticate, authorize } = require('../Helper/authenticate');

class ApiWrapper {
    constructor() {}

    async create(call, callback){
        try {
            const result = await businessLogic.create(call.request);
            callback(undefined, result);
        } catch (error) {
            GrpcHelper.respondWithError(error, callback);
        }
    } 
    async login(call, callback){
        try {
            const result = await businessLogic.login(call.request);
            callback(undefined, result);
        } catch (error) {
            GrpcHelper.respondWithError(error, callback);
        }
    }
    async getAll(call, callback){
        try {
            authenticate(call, callback);
            const result = await businessLogic.getAll(call.request);
            callback(undefined, { users: result });
        } catch (error) {
            GrpcHelper.respondWithError(error, callback);
        }
    }
    async getOne(call, callback){
        try {
            authenticate(call, callback);
            const result = await businessLogic.getOne(call.request);
            callback(undefined, result);
        } catch (error) {
            GrpcHelper.respondWithError(error, callback);
        }
    }
    async deleteOne(call, callback){
        try {
            authenticate(call, callback);
            const result = await businessLogic.deleteOne(call.request);
            callback(undefined, result);
        } catch (error) {
            GrpcHelper.respondWithError(error, callback);
        }
    }
    async update(call, callback){
        try {
            authenticate(call, callback);
            authorize(call, callback);
            const result = await businessLogic.update(call.request);
            callback(undefined, result);
        } catch (error) {
            GrpcHelper.respondWithError(error, callback);
        }
    }
    async getContestants(call, callback){
        try {
            authenticate(call, callback);
            const result = await businessLogic.getContestants(call.request);
            callback(undefined, { users: result });
        } catch (error) {
            GrpcHelper.respondWithError(error, callback);
        }
    }
    async getTopRankings(call, callback){
        try {
            authenticate(call, callback);
            const result = await businessLogic.getTopRankings(call.request);
            callback(undefined, { users: result });
        } catch (error) {
            GrpcHelper.respondWithError(error, callback);
        }
    } 
       async logout(call, callback){
        try {
            //authenticate(call, callback);
            const result = await businessLogic.logout(call.request);
            callback(undefined, result );
        } catch (error) {
            GrpcHelper.respondWithError(error, callback);
        }
    }  

}

module.exports = ApiWrapper;
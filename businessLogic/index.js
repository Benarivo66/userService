const jwt = require('jsonwebtoken');
const grpc = require('@grpc/grpc-js');
const { userDBMethods } = require('db-methods');
const ServerError = require('service-specs').ServerError;
const request = require('request');
const Auth = require('../Helper/auth');

const tokenKey = process.env.TOKEN_KEY;

module.exports = {
    async create(args){
        const hashedPassword = await Auth.hash(args.password);

        let user = await userDBMethods.getByEmail(args.email);
        if(user) {
            throw new ServerError(grpc.status.ALREADY_EXISTS, 'user already exists');
        };   
        const userFields = {
            email: args.email,
            name: args.name,
            age: args.age,
            password: hashedPassword
        };    
        
        user = await userDBMethods.create(userFields);
        const token = jwt.sign({ email: args.email, id: user._id }, tokenKey, {
            expiresIn: '1h'
        });    
        user.token = token;
        
        return user;
    },
    async login({ email, password }){
        const user = await userDBMethods.getByEmail(email);

        if(!user){
            throw new ServerError(grpc.status.INVALID_ARGUMENT, 'email does not exist');
        }
        const isVerified = await Auth.verify(password, user.password);
        if(!isVerified){
            throw new ServerError(grpc.status.INVALID_ARGUMENT, 'Password does not match');
        }
        const token = jwt.sign({email, id: user._id}, tokenKey, {
            expiresIn: '1h'
        });
        user.token = token;

        return user;
    },
    async getAll(){
        const users = await userDBMethods.getAll();

        if(!users){
            throw new ServerError(grpc.status.NOT_FOUND, 'no user found');
        }
        
        return users;
    },
    async getOne({_id}){
        const user = await userDBMethods.getOne(_id);

        if(!user){
            throw new ServerError(grpc.status.NOT_FOUND, 'user does not exist');
        }
        return user;
    },
    async deleteOne({_id}){
        const user = await userDBMethods.update(_id, { deleted: true });
        if(!user){
            throw new ServerError(grpc.status.NOT_FOUND, 'user does not exist');
        }
        return user;
    },
    async update(args){
        const user = await userDBMethods.getOne(args._id);

        if(!user){
            throw new ServerError(grpc.status.NOT_FOUND, 'user does not exist');
        }

        user.email = args.email || user.email;
        user.name = args.name || user.name;
        user.age = args.age || user.age;
        user.description = args.description || user.description;

        //only admin can do this
        user.isAdmin = args.isAdmin;
        user.isContestant = args.isContestant;
        user.contestantNumber = args.contestantNumber 
        
        await userDBMethods.update(args._id, {...user});
        
        return user;
    },
    async getContestants(){
        const users = await userDBMethods.getContestants();

        if(!users){
            throw new ServerError(grpc.status.NOT_FOUND, 'no user found');
        };

        return users;
    },
    
    async getTopRankings(){
        const users = await userDBMethods.getTopRankings();

        if(!users){
            throw new ServerError(grpc.status.NOT_FOUND, 'no user found');
        };

        return users;
    }
}

/*
May have to pass magic token directly as an argument
see all the possible ways of storing logged in user data in express
**/


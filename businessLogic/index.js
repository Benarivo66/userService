const jwt = require('jsonwebtoken');
const grpc = require('@grpc/grpc-js');
const { userDBMethods } = require('db-methods');
const Auth = require('../Helper/auth')
const ServerError = require('service-specs').ServerError;

const tokenKey = process.env.TOKEN_KEY;

module.exports = {
    async create({ email, password }){
        const hashedPassword = await Auth.hash(password);

        let user = await userDBMethods.getByEmail(email);
        if(user) {
            throw new ServerError(grpc.status.ALREADY_EXISTS, 'user already exists');
        };   
        const userFields = {
            email,
            password: hashedPassword
        };    
        
        user = await userDBMethods.create(userFields);
        const token = jwt.sign({ email, id: user._id }, tokenKey, {
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
            throw new ServerError(grpc.status.NOT_FOUND, 'user does not exist');
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
    async update({_id, email, isAdmin}){
        const user = await userDBMethods.getOne(_id);

        if(!user){
            throw new ServerError(grpc.status.NOT_FOUND, 'user does not exist');
        }

        user.email = email;
        user.isAdmin = isAdmin;
        
        await userDBMethods.update(_id, {...user});
        
        return user;
    },  

   
      
}
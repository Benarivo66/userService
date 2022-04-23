const jwt = require('jsonwebtoken');
const Auth = require('../Helper/auth')
const { userDBMethods } = require('db-methods');

const tokenKey = process.env.TOKEN_KEY;

module.exports = {
    async create({ email, password }){
        const hashedPassword = await Auth.hash(password);

        let user = await userDBMethods.getByEmail(email);
        if(user) {
            return { message: 'User already exists' }
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
            return { message: 'Invalid Credentials' }
        }
        const isVerified = await Auth.verify(password, user.password);
        if(!isVerified){
            return { message: 'enter a valid password' }
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
            return { message: 'no user found' };
        }
        
        return users;
    },
    async getOne({_id}){
        const user = await userDBMethods.getOne(_id);

        if(!user){
            return { message: 'user not found' };
        }
        return user;
    }
}
const jwt = require('jsonwebtoken');
const tokenKey = process.env.TOKEN_KEY;

module.exports = {
    async authenticate(call, callback){
        console.log('authenticate', call.metadata);
        if(call.metadata.internalRepr == null ||
             call.metadata.internalRepr.get('jwt') === undefined){
            callback(new Error('Please log in to access this route'), null);
            return;
        }
        
        const jwtArray = call.metadata.internalRepr.get('jwt');
        
        const jwtString = jwtArray[jwtArray.length - 1];

        const token = jwtString.split(';')[0];
        
        const decoded = jwt.verify(token, tokenKey);

        if(decoded) return;
        else{ 
            callback(new Error('Unauthenticated'));
        } 
    },
    async authorize(call, callback){
        const isAdmin = call.metadata.internalRepr.get('jwt')[0].split(';')[1].trim();
        if(isAdmin === false.toString()){
           callback(new Error('Only Admin can access'));
           return;
       }

       //const isAdmin = call.metadata.internalRepr.get('isAdmin');
       if(isAdmin) return;
       else callback(new Error('Unauthorized request'));
    }
}
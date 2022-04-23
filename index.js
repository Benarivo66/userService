const grpc = require('@grpc/grpc-js');
const ApiWrapper = require('./apiWrapper/apiWrapper');
const ApiSpec = require('service-specs');
const { dbConnect } = require('db-methods');

require("dotenv").config();

function configureMethods(){
    const apiWrapper = new ApiWrapper();

    return apiWrapper;
}

function start(){
    const server = new grpc.Server();
  
    const proto = ApiSpec.load(grpc, 'user');


    const config = process.env;

    const serviceMethods = configureMethods(config);
    
    server.addService(proto.UserServiceRoutes.service, serviceMethods);

    const address = `127.0.0.1:${config.PORT}`;
    
    server.bindAsync(address, grpc.ServerCredentials.createInsecure(), () => {
        dbConnect();
        console.log(`Server running at ${address}`);
        server.start();
    })
}

start();

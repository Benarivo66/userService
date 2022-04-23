const { client } = require('service-specs');
const { dbConnect } = require('db-methods');

dbConnect();
require("dotenv").config();

const user = require('./businessLogic').create({email:'3rd email', password: 'password'});

client.create({email:"emailz", password:"password"}, async (error, _) => {
    //if(error) throw error
    console.log(await user);
})


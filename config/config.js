require('dotenv').config();


module.exports ={
    dbUrl:process.env.dbUrl,
    secretKey:process.env.secretKey,
    PORT:process.env.port,
};

// console.log(process.env.dbUrl)
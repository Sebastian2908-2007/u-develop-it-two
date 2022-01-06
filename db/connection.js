require('dotenv').config();
const mysql = require('mysql2');

// MYSQL CONNECTION
const db = mysql.createConnection(
    { 
    host: process.env.host,
    user: process.env.user,
    password: process.env.password,
    database: process.env.database
    },
   
);


module.exports = db;
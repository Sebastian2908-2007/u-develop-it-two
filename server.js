require('dotenv').config();
const mysql = require('mysql2');
const express = require('express');
const PORT = process.env.PORT || 3001;
const app = express();


// Express middleware
app.use(express.urlencoded({extended: false}));
app.use(express.json());


// MYSQL CONNECTION
const db = mysql.createConnection(
    { 
    host: process.env.host,
    user: process.env.user,
    password: process.env.password,
    database: process.env.database
    },
   
);
db.connect(function(err){
    if(err) {
        console.log('somethings wrong');
        return;
    }
    console.log('connected to election db successfully');
    
});

db.query(`SELECT * FROM candidates`, (err,rows) => {
    console.log(rows);
});



//default response for any other request (Not Found)
app.use((req,res) => {
    res.status(404).end();
});


// server connection
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
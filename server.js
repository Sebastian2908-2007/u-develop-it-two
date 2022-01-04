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
    console.log('Connected to the election database.')
);
db.connect(function(err){})




//default response for any other request (Not Found)
app.use((req,res) => {
    res.status(404).end();
});


// server connection
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
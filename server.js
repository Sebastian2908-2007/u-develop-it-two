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

// get all candidates
/*db.query(`SELECT * FROM candidates`, (err,rows) => {
    //console.log(rows);
});*/

// get candidate by id
/*db.query(`SELECT * FROM  candidates WHERE id = 1`,(err,row) => {
    if(err) {
        console.log(err);
    }
    //console.log(row);
});*/

/*db.query(`DELETE FROM candidates WHERE id = ?`,1,(err,result) => {
    if (err) {
        console.log(err);
    }
    console.log(result);
});*/

// create candidate
const sql = `INSERT INTO candidates(id,first_name,last_name,industry_connected)
VALUES (?,?,?,?)`;

const params = [1,'Ronald','firbank',1];

db.query(sql,params,(err,result) => {
    if (err) {
        console.log(err);
    }
    console.log(result);
});



//default response for any other request (Not Found)
app.use((req,res) => {
    res.status(404).end();
});


// server connection
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
require('dotenv').config();
const mysql = require('mysql2');
const express = require('express');
const PORT = process.env.PORT || 3001;
const app = express();


// Express middleware
app.use(express.urlencoded({extended: false}));
app.use(express.json());
const inputCheck = require('./utils/inputCheck');

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

app.get('/api/candidates',(req,res) => {
// get all candidates
const sql = `SELECT * FROM candidates`;
  db.query(sql, (err,rows) => {
   if(err) {
       res.statusCode(500).json({error: err.message});
       return;
   }
   res.json({
       message: 'success',
       data: rows
   }); 
 });
});

// get candidate by id
app.get('/api/candidate/:id',(req,res) => {
    const sql = `SELECT * FROM  candidates WHERE id = ?`;
    const params = [req.params.id];
  db.query(sql,params,(err,row) => {
    if(err) {
      res.statusCode(400).json({error: error.message});
    }
    res.json({
        message:'success',
        data: row
    }); 
  });
});


  // delete a candidate
  app.delete('/api/candidate/:id',(req,res) => {
      const sql =`DELETE FROM candidates WHERE id = ?`;
      const params = [req.params.id]; 
  db.query(sql,params,(err,result) => {
    if (err) {
        res.statusCode(400).json({error: error.message});
    }else if (!result.affectedRows) {
        res.json({
            message:'Candidate not found'
        });
    }else{ 
        res.json({
          message: 'deleted',
          changes: result.affectedRows,
          id: req.params.id
        });
     }
  });
});

// create candidate
  app.post('/api/candidate',({body},res) => {
      const errors = inputCheck(body, 'first_name', 'last_name','industry_connected');
      if(errors) {
        res.statusCode(400).json({error: errors});
      }

const sql = `INSERT INTO candidates(first_name,last_name,industry_connected)
VALUES (?,?,?)`;

const params = [body.first_name,body.last_name,body.industry_connected];

db.query(sql,params,(err,result) => {
    if (err) {
        res.status(400).json({error: err.message})
        return;
    }
    res.json({
     message:'success',
     data: body
    });
  });
});



//default response for any other request (Not Found)
app.use((req,res) => {
    res.status(404).end();
});


// server connection
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
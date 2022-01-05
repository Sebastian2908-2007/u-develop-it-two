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
const sql = `SELECT candidates.*,parties.name
AS party_name
FROM candidates
LEFT JOIN parties
ON candidates.party_id = parties.id`;
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
   /*sql query*/
    const sql = `SELECT candidates.*,parties.name
    AS party_name
    FROM candidates
    LEFT JOIN parties
    ON candidates.party_id = parties.id
    WHERE candidates.id = ?`;
    /*id sent from client */
    const params = [req.params.id];
    /**query to sql database */
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

// update a candidate's party
app.put('/api/candidate/:id',(req,res) => {

  // check for errors in request
  const errors = inputCheck(req.body,'party_id');

  if(errors) {
    res.status(400).json({error: errors});
    return;
  }

   const sql = `UPDATE candidates SET party_id = ?
                  WHERE id = ?`;
   const params = [req.body.party_id,req.params.id];
   db.query(sql,params,(err,result) => {
     if(err) {
       res.status(400).json({error: err.message});
     } else if (!result.affectedRows) {
       res.json({
         message: 'Candidate not found'
       });
     }else {
       res.json({
         message: 'success',
         data: req.body,
         changes: result.affectedRows
       });
     }
   });               
});


// get all parties
app.get('/api/parties', (req,res) => {
  const sql = `SELECT * FROM parties`;
  db.query(sql, (err,rows) => {
    if (err) {
      res.status(500).json({error: err.message});
      return;
    }
    res.json({
      message: 'success',
      data: rows 
    });
  });
});

// get party by id
app.get('/api/party/:id', (req,res) => {
  const sql = 'SELECT * FROM parties WHERE id = ?'
  const params = [req.params.id];
  db.query(sql,params,(err,row) => {
    if(err) {
      res.status(400).json({error: err.message});
      return;
    }
    res.json({
      message: 'success',
      data: row
    });
  });
});

// delete a party
app.delete('/api/party/:id',(req,res) => {
  const sql = 'DELETE FROM parties WHERE id = ?';
  const params = [req.params.id];
  db.query(sql,params,(err,result) => {
    if (err) {
      res.status(400).json({error: err.message});
      return;
    }else if (!result.affectedRows) {
      res.json({
        message: 'party not found'
      });
    }else{
      res.json({
        message:'success',
        changes: result.affectedRows,
        id: req.params.id
      });
    }
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
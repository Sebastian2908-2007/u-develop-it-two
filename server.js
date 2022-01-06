const express = require('express');
const PORT = process.env.PORT || 3001;
const app = express();
const apiRoutes = require('./routes/apiRoutes');
const db = require('./db/connection');


// Express middleware
app.use(express.urlencoded({extended: false}));
app.use(express.json());

// use the apiRoutes
app.use('/api',apiRoutes);

//default response for any other request (Not Found)
app.use((req,res) => {
    res.status(404).end();
});




db.connect(function(err){
  if(err) throw err;
  console.log('connected to election db successfully');
// server connection
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
  
});

const connectToMongo = require('./db');
const cors = require('cors');
connectToMongo();  
const path = require('path');
const express = require('express');
const app = express()
const port=process.env.PORT || 5000
 

app.use('/files', express.static(path.join(__dirname, '../files/image')));
app.use(express.json()); 


app.use(cors({
  origin: 'http://localhost:3000', // Allow requests
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  allowedHeaders: ['Content-Type', 'Authorization', 'auth-token'], 
}));

 // Apply CORS with the specified options
app.options('*', cors());  


app.use('/api/auth', require('./routes/auth'));
app.use('/api/notes', require('./routes/notes'));
app.use(express.urlencoded({extended:false}))

app.listen(port, () => {
  console.log('Server is running on http://localhost:5000');
});


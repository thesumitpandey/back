const connectToMongo = require('./db');
const cors = require('cors');
connectToMongo();  
const path = require('path');
const express = require('express');
const app = express()
app.use('/files', express.static(path.join(__dirname, '../files/image')));
app.use(express.json()); 


app.use(cors());  
app.options('*', cors());

app.use('/api/auth', require('./routes/auth'));
app.use('/api/notes', require('./routes/notes'));
app.use(express.urlencoded({extended:false}))

app.listen(5000, () => {
  console.log('Server is running on http://localhost:5000');
});


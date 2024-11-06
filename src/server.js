// src/server.js
const express = require('express');
const dotenv = require('dotenv');
const cors = require('cors');
// Load environment variables from .env file

//Load Routes.......

var index = require('./routes/index');
const bodyParser =  require('body-parser');
const formidable = require('express-formidable');

const database = require('./models/index');

 

dotenv.config();

const app = express();
app.use(cors());
// app.use(bodyParser.json())

//Use Routes

app.use(formidable({maxFieldsSize:50971520}));

app.use('/', index);

// Start the server
const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

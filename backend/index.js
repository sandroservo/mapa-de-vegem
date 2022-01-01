const express = require('express');
//const mongoose = require('mongoose');
const dotenv = require('dotenv');
const app = express();


require('./database');

app.use(express.json);

// mongoose
//   .connect(process.env.MONGO_URI, {
//     useNewUrlParser: true,
//     useUnifiedTopology: true,
//   })
//   .then(() => {
//     console.log('Mongo Connectd');
//   })
//   .catch((err) => console.log(err));

app.listen(8800, () => {
    console.log("🚀 server is running");
  })
const express = require('express');
const morgan = require('morgan');
const cors = require('cors');
const pinRoutes = require('./routes/pins');
const userRoutes = require('./routes/users');


require('./database');
const app = express();

app.use(morgan('dev'));
app.use(express.json());
app.use(cors());

app.use('/api/users', userRoutes);
app.use('/api/pins', pinRoutes);

//console.log(pinRoutes);

app.listen(3333, () => {
    console.log("🚀 server is running");
  })
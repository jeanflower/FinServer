// following tutorial here
// https://codeburst.io/writing-a-crud-app-with-node-js-and-mongodb-e0827cbbdafb
require('./env')
const express = require('express');
const bodyParser = require('body-parser');
const finkitty = require('./src/routes/finkitty.route');
const app = express();
const port = 3001;

const mongoose = require('mongoose');

mongoose.connect(
  process.env.MONGO_URL,
  {dbName: 'FinKittyData'},
);
mongoose.Promise = global.Promise;
const db = mongoose.connection;
db.on('error', console.error.bind(console, 'MongoDB connection error:'));
// if we get connection errors, try checking the ip address of this
// server is whitelisted, e.g. on https://cloud.mongodb.com/

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: false}));
app.use('/finkitty', finkitty);

app.listen(
  port,
  () => {
    return console.log(`FinKitty server listening on port ${port}!`);
  },
);

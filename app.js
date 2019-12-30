// following tutorial here
// https://codeburst.io/writing-a-crud-app-with-node-js-and-mongodb-e0827cbbdafb

const express = require('express');
const bodyParser = require('body-parser');
const product = require('./src/routes/product.route');
const app = express();
const mongoose = require('mongoose');

console.log(`process.env.MONGO_URL = ${process.env.MONGO_URL}`);
mongoose.connect(
  process.env.MONGO_URL,
  {dbName: 'test'} 
);
mongoose.Promise = global.Promise;
const db = mongoose.connection;
db.on('error', console.error.bind(console, 'MongoDB connection error:'));
// if we get connection errors, try checking the ip address of this
// server is whitelisted, e.g. on https://cloud.mongodb.com/

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: false}));
app.use('/products', product);

let port = 1234;
app.listen(port, () => {
    console.log('Server is up and running on port number ' + port);
});

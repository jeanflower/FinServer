var constants = require('./constants');

// following tutorial here
// https://codeburst.io/writing-a-crud-app-with-node-js-and-mongodb-e0827cbbdafb
require('./env')
const express = require('express');
const bodyParser = require('body-parser');
const route = require(`./src/routes/${constants.route}.route`);
const app = express();
const cors = require('cors');

const mongoose = require('mongoose');

console.log(`process.env.MONGODB_URI_JAF = ${process.env.MONGODB_URI_JAF}`);

/*
// from the MongoDB Node.js driver:
DeprecationWarning: current URL string parser is deprecated, and will be removed 
in a future version. To use the new parser, 
pass option { useNewUrlParser: true } to MongoClient.connect.
(node:32002) DeprecationWarning: current Server Discovery and Monitoring engine is deprecated, 
and will be removed in a future version. To use the new Server Discover and Monitoring engine, 
pass option { useUnifiedTopology: true } to the MongoClient constructor.
//
// Advice from mongoose:
//https://mongoosejs.com/docs/deprecations.html
*/

mongoose.set('useNewUrlParser', true);
mongoose.set('useFindAndModify', false);
mongoose.set('useCreateIndex', true);
mongoose.set('useUnifiedTopology', true);

mongoose.connect(
  process.env.MONGODB_URI_JAF,
  { dbName: constants.mongoDBName },
);
mongoose.Promise = global.Promise;
const db = mongoose.connection;
db.on('error', console.error.bind(console, 'MongoDB connection error:'));
// if we get connection errors, try checking the ip address of this
// server is whitelisted, e.g. on https://cloud.mongodb.com/

app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
  extended: false,
  limit: '25mb',
}));

app.use(`/${constants.route}`, route);

let port = process.env.PORT;
if (port == null || port == "") {
  port = 3001;
}
console.log(`port = ${port}`);
app.listen(
  port,
  () => {
    return console.log(`${constants.mongoDBName} server listening on port ${port}`);
  },
);

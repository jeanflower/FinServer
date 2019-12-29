const database = require('./src/database');
//const log = require('./src/utils').log;
const express = require('express');
const app = express();
const port = 3001;

app.use(express.json());

app.get(
  '/', 
  async (req, res) => {
    console.log(`model names are ${await database.getModelNames('TestUserID')}`);
    console.log(req.header('tableName'));
    console.log(JSON.stringify(req.body));
    return res.send('Hello World!!');
  },
);

app.listen(
  port, 
  () => {
    return console.log(`FinKitty server listening on port ${port}!`);
  },
);

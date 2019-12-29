const AWS = require('aws-sdk');
const tableName = 'FinKittyModels';
require('dotenv').config();

let ddb = undefined;

function setupDDB() {
  console.log(`setupDDB`);
  if (ddb !== undefined) {
    // console.log(`found DB OK`);
    return;
  }
  const useLocalDB = 
    process.env.REACT_APP_AWS_USE_LOCAL === 'true';
  console.log(`use local db? ${process.env.REACT_APP_AWS_USE_LOCAL}`);
  const accessKeyID = useLocalDB
    ? process.env.REACT_APP_AWS_ACCESS_KEY_ID_FORLOCALACCESS
    : process.env.REACT_APP_AWS_ACCESS_KEY_ID;
  const secretAccessKey = useLocalDB
    ? process.env.REACT_APP_AWS_SECRET_ACCESS_KEY_FORLOCALACCESS
    : process.env.REACT_APP_AWS_SECRET_ACCESS_KEY;
  const region = useLocalDB
    ? process.env.REACT_APP_AWS_REGION_FORLOCALACCESS
    : process.env.REACT_APP_AWS_REGION;
  const endpoint = useLocalDB
    ? process.env.REACT_APP_AWS_ENDPOINT_FORLOCALACCESS
    : process.env.REACT_APP_AWS_ENDPOINT;

  // Set the credentials and the region
  // this is insecure and the wrong way to do it
  AWS.config.update({
    accessKeyId: accessKeyID,
    secretAccessKey: secretAccessKey,
    region: region,
  });

  // Create the DynamoDB service object
  ddb = new AWS.DynamoDB({ apiVersion: '2012-10-08' });
  ddb.setEndpoint(endpoint);

  // console.log(`set up DDB`);
}

async function getTableNames(ddb) {
  // console.log(`Get a list of the table names`);
  const dbData = await new Promise((resolve, reject) => {
    ddb.listTables({}, (err, data) => {
      if (err) {
        console.log(`error from listTables : ${err.code},${err.stack}`);
        reject(err);
      } else {
        resolve(data);
      }
    });
  });
  return dbData.TableNames;
}

async function tableExists(ddb) {
  const tableNames = await getTableNames(ddb);
  // console.log(`tableNames = ${tableNames}`);

  if (tableNames.indexOf(tableName) === -1) {
    console.log('No tables');
    return false;
  }
  return true;
}

function makeTableDefinition() {
  // console.log(`tableName = ${tableName}, key = ${key}`);
  const params = {
    //TableArn: process.env.REACT_APP_AWS_TABLE_ARN,
    TableName: tableName,
    AttributeDefinitions: [
      {
        AttributeName: 'UserID',
        AttributeType: 'S',
      },
      {
        AttributeName: 'ModelName',
        AttributeType: 'S',
      },
    ],
    KeySchema: [
      {
        KeyType: 'HASH',
        AttributeName: 'UserID',
      },
      {
        KeyType: 'RANGE',
        AttributeName: 'ModelName',
      },
    ],
  };
  // console.log('made table definition '+showObj(params));
  return params;
}

async function createTable(ddb) {
  // console.log('In createTable, for '+tableName);
  const params = makeTableDefinition();

  params.ProvisionedThroughput = {
    ReadCapacityUnits: 1,
    WriteCapacityUnits: 1,
  };
  params.StreamSpecification = {
    StreamEnabled: false,
  };
  try {
    // console.log(`Go create table with ${showObj(params)}`);
    await new Promise((resolve, reject) => {
      ddb.createTable(params, (err, data) => {
        if (err) {
          console.log(
            `error from createTable : ${showObj(params)}, ${err}${err.stack}`,
          );
          reject(err);
        } else {
          resolve(data);
        }
      });
    });
    // console.log('Created table');
  } catch (error) {
    console.log(`Error creating table${error}`);
  }
}

// see https://github.com/aws/aws-sdk-js/issues/2700
async function putItem(ddb, params) {
  console.log(`go to put Item ${showObj(params)}`);

  await new Promise((resolve, reject) => {
    ddb.putItem(params, (err, data) => {
      if (err) {
        console.log(`error from putItem : ${showObj(params)}, ${err}${err.stack}`);
        reject(err);
      } else {
        // console.log(`put item resolved OK`);
        resolve(data);
      }
    });
  });
}

async function ensureTableExists() {
  console.log('in ensureTableExists');
  setupDDB();
  if (!(await tableExists(ddb))) {
    // console.log('table does not exist!');
    await createTable(ddb);
  }
  if (!(await tableExists(ddb))) {
    console.log('table still does not exist!!');
    await createTable(ddb);
  }
}

async function deleteModel(userID, modelName) {
  await ensureTableExists();

  const params = {
    Key: {
      UserID: {
        S: userID,
      },
      ModelName: {
        S: modelName,
      },
    },
    TableName: tableName,
  };

  const doDBDelete = (params) => {
    return new Promise((resolve, reject) => {
      ddb.deleteItem(params, function(err, data) {
        if (err) {
          console.error(
            'Unable to delete. Error:',
            JSON.stringify(err, null, 2),
          );
          reject(err);
        } else {
          // console.log("Model delete succeeded.");
          resolve();
        }
      });
    });
  };
  return doDBDelete(params);
}

async function saveModel(
  userID,
  modelName,
  modelString,
) {
  await ensureTableExists();
  await deleteModel(userID, modelName);

  const params = {
    TableName: tableName,
    Item: {
      UserID: { S: userID },
      ModelName: { S: modelName },
      Item: { S: modelString },
    },
  };
  // console.log('go to put Item into ddb');
  return putItem(ddb, params);
}

// see https://docs.aws.amazon.com/sdk-for-javascript/v2/developer-guide/dynamodb-example-query-scan.html
exports.getModelNames = async (userID) => {
  console.log(`get model names for ${userID}`);
/*  
  return new Promise((resolve)=>{
    resolve(['apple', 'banana']);
  });
*/
  await ensureTableExists();
  const params = {
    ExpressionAttributeValues: {
      ':u': { S: userID },
    },
    KeyConditionExpression: 'UserID = :u',
    ProjectionExpression: 'ModelName',
    TableName: tableName,
  };

  const doDBQuery = (params) => {
    return new Promise((resolve, reject) => {
      ddb.query(params, function(err, data) {
        if (err) {
          console.error(
            'Unable to query. Error:',
            JSON.stringify(err, null, 2),
          );
          reject(err);
        } else if (data === undefined) {
          console.error('Unable to query. Undefined data.');
          reject('Unable to query. Undefined data.');
        } else if (data.Items === undefined) {
          console.error('Unable to query. Undefined data.');
          reject('Unable to query. Undefined data.');
        } else {
          // console.log("ModelNames query succeeded.");
          // data.Items.forEach(function(item:any) {
          //   console.log(`ModelNames item = ${JSON.stringify(item)}`);
          // });
          const names = data.Items.map((item) => {
            return item['ModelName'].S;
          });
          // console.log(`ModelNames names = ${names}, array length ${names.length}`);
          resolve(names);
        }
      });
    });
  };
  return doDBQuery(params);
}

async function tryLoadModel(
  userID,
  modelName,
) {
  await ensureTableExists();

  const params = {
    ExpressionAttributeValues: {
      ':u': { S: userID },
      ':m': { S: modelName },
    },
    KeyConditionExpression: 'UserID = :u and ModelName = :m',
    TableName: tableName,
  };

  const doDBQuery = (params) => {
    return new Promise((resolve, reject) => {
      //console.log(`query params = ${showObj(params)}`);
      ddb.query(params, function(err, data) {
        if (err) {
          console.error(
            'Unable to query. Error:',
            JSON.stringify(err, null, 2),
          );
          reject(err);
        } else if (data === undefined) {
          console.error('Unable to query. Undefined data.');
          reject('Unable to query. Undefined data.');
        } else if (data.Items === undefined) {
          console.error('Unable to query. Undefined data.');
          reject('Unable to query. Undefined data.');
        } else {
          //console.log(`Model query returned ${data.Items.length} items.`);
          //data.Items.forEach(function(item:any) {
          //  console.log(`Model item = ${JSON.stringify(item)}`);
          //});
          const models = data.Items.map((item) => {
            return JSON.parse(item['Item'].S);
          });
          // console.log(`Model models = ${models}, array length ${models.length}`);
          // console.log(`return model ${showObj(models[0])}`);

          if (models.length !== 1) {
            reject(`didn't find one model; found ${models}`);
          } else {
            resolve(models[0]);
          }
        }
      });
    });
  };
  return doDBQuery(params);
}

exports.loadModel = (
  userID,
  modelName,
) => {
  return tryLoadModel(userID, modelName).then(
    (value) => {
      return new Promise(function(resolve) {
        resolve(value);
      });
    },
    () => {
      console.log('second try at loading model...');
      return tryLoadModel(userID, modelName).then(
        (value) => {
          return new Promise(function(resolve) {
            resolve(value);
          });
        },
        () => {
          console.log('third try at loading model...');
          return tryLoadModel(userID, modelName);
        },
      );
    },
  );
}

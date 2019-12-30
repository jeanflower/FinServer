var util = require('util');
const FinKittyModel = require('../models/FinKittyModel.model');

//Simple version, without validation or sanitation
exports.test = function (req, res) {
    res.send('Greetings from the Test controller!');
};

/*
Set this as an index in mongoDB to prevent duplicates
{
  "FinKittyUserID": 1,
  "FinKittyModelName": -1,
}
{
  unique: true
}
*/

///// CREATE /////
/*
// Postman-generated client code for creating a DB entry
var myHeaders = new Headers();
myHeaders.append("Content-Type", "application/x-www-form-urlencoded");

var urlencoded = new URLSearchParams();
urlencoded.append("userID", "123ID");
urlencoded.append("modelName", "SampleModel5");
urlencoded.append("model", "{\"triggers\":[],\"expenses\":[],\"incomes\":[{\"NAME\":\"income\",\"VALUE\":\"6000\",\"VALUE_SET\":\"2017\",\"START\":\"2018\",\"END\":\"2019\",\"GROWTH\":\"2\",\"CPI_IMMUNE\":false,\"LIABILITY\":\"IncomeTaxBen\",\"CATEGORY\":\"\"}],\"transactions\":[],\"assets\":[{\"NAME\":\"Cash\",\"START\":\"1 Jan 1990\",\"VALUE\":\"0\",\"GROWTH\":\"0.0\",\"CPI_IMMUNE\":false,\"CAN_BE_NEGATIVE\":true,\"LIABILITY\":\"\",\"PURCHASE_PRICE\":\"0\",\"CATEGORY\":\"\"},{\"NAME\":\"loan\",\"START\":\"2018\",\"VALUE\":\"-1000\",\"GROWTH\":\"0\",\"CPI_IMMUNE\":false,\"CAN_BE_NEGATIVE\":true,\"LIABILITY\":\"\",\"PURCHASE_PRICE\":\"0\",\"CATEGORY\":\"\"},{\"NAME\":\"stock\",\"START\":\"2019\",\"VALUE\":\"40000\",\"GROWTH\":\"50\",\"CPI_IMMUNE\":true,\"CAN_BE_NEGATIVE\":false,\"LIABILITY\":\"\",\"PURCHASE_PRICE\":\"0\",\"CATEGORY\":\"\"},{\"NAME\":\"TaxPot\",\"START\":\"1 Jan 2017\",\"VALUE\":\"0\",\"GROWTH\":\"0\",\"CPI_IMMUNE\":true,\"CAN_BE_NEGATIVE\":false,\"LIABILITY\":\"\",\"PURCHASE_PRICE\":\"0\",\"CATEGORY\":\"\"}],\"settings\":[{\"NAME\":\"Beginning of view range\",\"VALUE\":\"1 Jan 2017\",\"HINT\":\"Date at the start of range to be plotted\"},{\"NAME\":\"cpi\",\"VALUE\":\"2.5\",\"HINT\":\"Annual rate of inflation\"},{\"NAME\":\"Date of birth\",\"VALUE\":\"\",\"HINT\":\"Date used for representing dates as ages\"},{\"NAME\":\"End of view range\",\"VALUE\":\"1 Jan 2020\",\"HINT\":\"Date at the end of range to be plotted\"},{\"NAME\":\"Focus of assets chart\",\"VALUE\":\"Cash\",\"HINT\":\"Assets chart can display a category, a single asset, or 'All'\"},{\"NAME\":\"Focus of expenses chart\",\"VALUE\":\"All\",\"HINT\":\"Expenses chart can display a category, a single expense, or 'All'\"},{\"NAME\":\"Focus of incomes chart\",\"VALUE\":\"All\",\"HINT\":\"Incomes chart can display a category, a single income, or 'All'\"},{\"NAME\":\"Type of view for asset chart\",\"VALUE\":\"val\",\"HINT\":\"Asset chart uses setting '+', '-', '+-' or 'val'\"},{\"NAME\":\"View detail\",\"VALUE\":\"Detailed view\",\"HINT\":\"View detail ('Categorised view' or 'Detailed view')\"},{\"NAME\":\"View frequency\",\"VALUE\":\"Monthly\",\"HINT\":\"Data plotted 'monthly' or 'annually'\"}]}");

var requestOptions = {
  method: 'POST',
  headers: myHeaders,
  body: urlencoded,
  redirect: 'follow'
};

fetch("localhost:3001/finkitty/create", requestOptions)
  .then(response => response.text())
  .then(result => console.log(result))
  .catch(error => console.log('error', error));
*/
exports.model_create = function (req, res) {
  const req_data = {
    FinKittyUserID: req.body.userID,
    FinKittyModelName: req.body.modelName,
    FinKittyModel: req.body.model,
  };
  // if the data is passed as parameters
  // instead of in the body of the request
  // this will be an empty object.
  console.log(`req_data = ${JSON.stringify(req_data)}`);

  let model = new FinKittyModel( req_data );
  console.log(`model._id = ${model._id}`);

  model.save(function (err) {
    if (err) {
      console.log(util.inspect(err.errmsg));
      if(err.errmsg.includes("duplicate key")){
        console.error("Creation refused for duplicate user/model key");
        res.send('Model Create failed - duplicate');
      } else {
        console.error("Error: "+err);
        res.send('Model Create failed');
      }
    } else {
      res.send('Model Created successfully');
    }
  })
};

///// QUERY /////
/*
// Postman-generated client code for querying a DB entry

var myHeaders = new Headers();
myHeaders.append("Content-Type", "application/x-www-form-urlencoded");

var urlencoded = new URLSearchParams();

var requestOptions = {
  method: 'GET',
  headers: myHeaders,
  body: urlencoded,
  redirect: 'follow'
};

fetch("localhost:3001/finkitty/find?userID=123ID&modelName=SampleModel3", requestOptions)
  .then(response => response.text())
  .then(result => console.log(result))
  .catch(error => console.log('error', error));
*/
exports.model_details = function (req, res) {
  //console.log(`req is ${util.inspect(req)}`);
  var query = { 
    FinKittyUserID: req.query.userID,
    FinKittyModelName: req.query.modelName,
  };
  // console.log(`query is ${JSON.stringify(query)}`);
  FinKittyModel.find(
    query, 
    function (err, model) {
      if (err) {
        console.error("Error: "+err);
        res.send('Query failed');
      } else {
        res.send(model);
      }
    }
  );
};

/*
// Postman-generated client code for querying for modelNames for a given user

var myHeaders = new Headers();
myHeaders.append("tableName", "hi");
myHeaders.append("Content-Type", "application/x-www-form-urlencoded");

var urlencoded = new URLSearchParams();

var requestOptions = {
  method: 'GET',
  headers: myHeaders,
  body: urlencoded,
  redirect: 'follow'
};

fetch("localhost:3001/finkitty/models?userID=123ID", requestOptions)
  .then(response => response.text())
  .then(result => console.log(result))
  .catch(error => console.log('error', error));
*/
exports.model_list = function (req, res) {
  //console.log(`req is ${util.inspect(req)}`);
  var query = { 
    FinKittyUserID: req.query.userID,
  };
  var projection = {
    _id: 0,
    FinKittyModelName: 1, 
  }
  // console.log(`query is ${JSON.stringify(query)}`);
  FinKittyModel.find(
    query, 
    projection,
    function (err, model) {
      if (err) {
        console.error("Error: "+err);
        res.send('Query failed');
      } else {
        res.send(model.map((m)=>{
          return m["FinKittyModelName"];
        }));
      }
    }
  );
};

///// UPDATE /////
/*
// Postman-generated client code for updating a DB entry

var myHeaders = new Headers();
myHeaders.append("Content-Type", "application/x-www-form-urlencoded");

var urlencoded = new URLSearchParams();
urlencoded.append("userID", "123ID");
urlencoded.append("modelName", "SampleModel5");
urlencoded.append("model", "{newModelData}");

var requestOptions = {
  method: 'PUT',
  headers: myHeaders,
  body: urlencoded,
  redirect: 'follow'
};

fetch("localhost:3001/finkitty/update", requestOptions)
  .then(response => response.text())
  .then(result => console.log(result))
  .catch(error => console.log('error', error));
*/

exports.model_update = function (req, res) {
  // console.log(`req.body is ${util.inspect(req.body)}`);
  var query = { 
    FinKittyUserID: req.body.userID,
    FinKittyModelName: req.body.modelName,
  };
  // console.log(`query is ${JSON.stringify(query)}`);
  var updateData = { 
    ...query,
    FinKittyModel: req.body.model,
  };
  // console.log(`updateData is ${JSON.stringify(updateData)}`);
  FinKittyModel.replaceOne(// or try updateOne
    query,
    updateData, 
    function (err, model) {
      if (err) {
        console.error("Error: "+err);
        res.send('Update failed');
      } else if(model["nModified"]===1){
        res.send(`One model updated.`);
      } else if(model["nModified"]===0){
        res.send(`No model updated.`);
      } else {
        res.send(`Model ${JSON.stringify(model)} updated.`);
      }
    }
  );
};

///// DELETE /////
/*
// Postman-generated client code for deleting a DB entry

var myHeaders = new Headers();
myHeaders.append("Content-Type", "application/x-www-form-urlencoded");

var urlencoded = new URLSearchParams();
urlencoded.append("userID", "123ID");
urlencoded.append("modelName", "SampleModel1");

var requestOptions = {
  method: 'DELETE',
  headers: myHeaders,
  body: urlencoded,
  redirect: 'follow'
};

fetch("localhost:3001/finkitty/delete", requestOptions)
  .then(response => response.text())
  .then(result => console.log(result))
  .catch(error => console.log('error', error));
*/
exports.model_delete = function (req, res) {
  // console.log(`req.body is ${util.inspect(req.body)}`);
  var query = { 
    FinKittyUserID: req.body.userID,
    FinKittyModelName: req.body.modelName,
  };
  FinKittyModel.deleteOne(
    query, 
    function (err, model) {
      if (err) {
        console.error("Error: "+err);
        res.send('Delete failed');
      } else if(model.deletedCount === 0){
        res.send('Nothing deleted');
      } else {
        res.send(`Deleted successfully!`);
      }
    },
  );
};

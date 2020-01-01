# FinServer
Builds a REST interface for data stored in a MongoDB collection.

# The REST interface
## The API
The interface is defined according to routes defined in FinServer/src/routes/finkitty.route.js
Roughly speaking, the routes are as follows:
 - A GET request, given a userID, obtains a list of the modelNames for that user.
 - A GET request, given a userID and a modelName, obtains the model data.
 - A PUT request, given a userID, a modelName and model data, writes as an update to an existing document.
 - A POST request, given a userID, a modelName and model data, creates a document with that data.
 - A DELETE request, given a userID and a modelName, deletes any matching document.

## The actions
The work undertaken by this app is defined in FinServer/src/controllers/finkitty.controller.js
Roughly speaking, the actions are:
 - For a model list, obtain the userID as a query parameter, get the model names from MongoDB, make a list and return.
 - For a model, obtain the userID and modelName as query parameters, get the model from MongoDB, decrypt and return.
 - For update, get the userID, modelName and model from the request body. Encrypt the model and save.
 - For create, get the userID, modelName and model from the request body. Encrypt the model and save.  Expect failure for duplicates.
 - For delete, get the userID and modelName from the request body. Delete any matching document.
 
# The MongoDB data
## Data structure
Each document in MongoDB is stored according to a schema defined in FinServer/src/models/FinKittyModel.model.js 
Roughly speaking, the schema consists of 
 - a user ID
 - a model name
 - the model data itself

These are strings.

## Data location
The app uses an environment variable (with mongo username, password and cluster completed) to know where to go for data.

```MONGODB_URI_JAF=mongodb+srv://<username>:<password>@<cluster>.mongodb.net/```

## Data encrption
The app encypts any model information before write to MongoDB, and decrypts it after read from MongoDB.  
An encyption secret needs to be stored as an environment variable

```MONGO_CRYPT_SECRET=<my_secret>```

## Data integrity
Setting up a MongoDB collection:
 - Network access: MongoDB clusters can have restrictions on access to certain IP addresses,
so failure to connect can be due to attempting to connect from a not-included IP address
 - Unique data keys: MongoDB will maintain uniqueness if it's given keys.  
This app expects the following key to be applied:

```
{
  "FinKittyUserID": 1,
  "FinKittyModelName": -1,
}
{
  unique: true
}
```

# Hosting

## Locally:
```NODE_ENV=development node index.js```

## On Heroku
The Procfile defines the actions of the corresponding Heroku app.  Heroku uses 'dynos' which run this Node app, list for REST calls and can access MongoDB.

Set appropriate environment variables (for MongoDB access and encryption) in the Heroku app at https://dashboard.heroku.com/.
Useful Heroku commands:
 - heroku login
 - git push heroku master
 - heroku ps
 - heroku ps:restart
 - heroku logs --tail


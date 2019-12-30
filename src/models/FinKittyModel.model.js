const mongoose = require('mongoose');
const Schema = mongoose.Schema;

let FinKittySchema = new Schema({
    FinKittyUserID: {type: String, required: true, max: 500},
    FinKittyModelName: {type: String, required: true, max: 100},
    FinKittyModel: {type: String, required: true, max: 32000},
});


// Export the model
module.exports = mongoose.model('FinKittyModel', FinKittySchema);

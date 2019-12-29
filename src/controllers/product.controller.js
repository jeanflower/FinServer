const Product = require('../models/product.model');

//Simple version, without validation or sanitation
exports.test = function (req, res) {
    res.send('Greetings from the Test controller!');
};

exports.product_create = function (req, res) {
  const req_data = {
    name: req.body.name,
    price: req.body.price
  };
  // if the name and price are passed as paramters
  // instead of in the body of the request
  // this will be an empty object.
  console.log(`req_data = ${JSON.stringify(req_data)}`);

  let product = new Product( req_data );
  // console.log(`product = ${product}`);

  product.save(function (err) {
    if (err) {
      console.error("Error: "+err);
      return;
    }
    res.send('Product Created successfully')
  })
};

exports.product_details = function (req, res) {
  Product.findById(
    req.params.id, 
    function (err, product) {
      if (err) {
        console.error("Error: "+err);
        return;
      }
      res.send(product);
    }
  );
};

exports.product_update = function (req, res) {
  Product.findByIdAndUpdate(
    req.params.id, 
    {$set: req.body}, 
    function (err, product) {
      if (err) {
        console.error("Error: "+err);
        return;
      }
      res.send('Product udpated.');
    }
  );
};

exports.product_delete = function (req, res) {
  Product.findByIdAndRemove(req.params.id, function (err) {
    if (err) {
      console.error("Error: "+err);
      return;
    }
    res.send('Deleted successfully!');
  })
};

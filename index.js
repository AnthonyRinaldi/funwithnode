var MongoClient = require('mongodb').MongoClient;
var restify = require('restify');
var assert = require('assert');
var ObjectId = require('mongodb').ObjectId;
var url = 'mongodb://localhost:27017/test';

MongoClient.connect(url, function(err, db) {
  assert.equal(null, err);
  console.log("Connected correctly to server.");
  db.close();
});

function respond(req, res, next) {
  res.send('hello ' + req.params.name);
  next();
}

function fetchAllRestaunts(req, res, next) {
  MongoClient.connect(url, function(err, db) {
    var cursor = db.collection('restaurants').find().toArray(function(err, items) {
            res.send(items);
        })
  })
}

function fetchRestaurantByID(req, res, next) {
  var id = req.params.id;
  console.log('fetch restaurant', id);
  MongoClient.connect(url, function(err, db) {
    db.collection('restaurants').findOne({'_id': new ObjectId(id)}, function(err, item) {
      if (item) {
        res.send(item);
      } else if (err) {
        res.send(500, err);
      } else {
        res.send(404);
      }
    })
  })
}

var server = restify.createServer();
server.get('/hello/:name', respond);
server.head('/hello/:name', respond);
server.get('/restaurants', fetchAllRestaunts);
server.get('/restaurants/:id', fetchRestaurantByID);
server.head('/restaurants/:id', fetchRestaurantByID);

server.listen(8080, function() {
  console.log('%s listening at %s', server.name, server.url);
});

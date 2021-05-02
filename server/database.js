const DataBase = function () {
  const MongoClient = require('mongodb').MongoClient;
  const ObjectId = require('mongodb').ObjectID;

  let db;

  function init(callback) {
    if (!db) {
      MongoClient.connect('mongodb://lab-user:lab-pwd@127.0.0.1:27017/lab-db', {useNewUrlParser: true}, (err, client) => {
        if (err) return console.log(err);
        db = client.db('lab-db');
        callback();
      });
    } else {
      callback();
    }
  }

  this.getCollection = function (collectionName, callback) {
    init(function () {
      db.collection(collectionName).find().toArray(callback);
    })
  };

  this.insertToCollection = function (collectionName, data, callback) {
    init(function () {
      db.collection(collectionName).insert(data, callback);
    })
  };

  this.removeFromCollection = function (collectionName, id, callback) {
    init(function () {
      db.collection(collectionName).remove({_id: ObjectId(id)}, {justOne: true}, callback)
    })
  };

  this.updateInCollection = function (collectionName, id, new_data, callback) {
    init(function () {
      db.collection(collectionName).updateOne({_id: ObjectId(id)}, {$set: new_data}, callback);
    })
  };

  this.groupByCurrency = function (callback) {
    init(function () {
      db.collection('operations').aggregate(
        [
          {
            $group: {
              _id: '$currency',
              sum: {$sum: {$toInt: '$sum'}},
            }
          },
          {
            $project: {
              _id: 0,
              currency: "$_id",
              sum: 1
            }
          }
        ], callback)
    })
  };

  this.greatSpending = function (callback) {
    callback(null, []);
  };

  this.getSpendingWithExchangeRate = function (callback) {
    init(function () {
      db.operations.aggregate([
        {
          $lookup:
            {
              from: "currency",
              localField: "currency",
              foreignField: "name",
              as: "rate"
            }
        },
        {
          $unwind: {
            path: "$rate"
          }
        },
        {
          $addFields: {
            convertedSum: {$toDouble: "$sum"}
          }
        }
      ], callback);
    });
  };

  this.convertIntoUah = function (callback) {
    callback(null, []);
  };
};

module.exports = DataBase;


const {MongoClient, ObjectID} = require('mongodb');

MongoClient.connect('mongodb://localhost:27017/TodoApp', (err, db) => {
  if (err) {
    return console.log('Unable to connect to MongoDB server');
  }
  console.log('Connected to MongoDB server');

  db.collection('Users').findOneAndUpdate({_id: new ObjectID('5b893db2a062101360c3cc26')}, {
      $set: {
          name: 'Tanveer Singh'
      },
      $inc: {
          age: -2
      }
  }, {
      returnOriginal: false
  }).then((results) => {
      console.log(results);
  })


});
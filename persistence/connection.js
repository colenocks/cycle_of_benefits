const dotenv = require("dotenv");
dotenv.config();

const MongoClient = require('mongodb').MongoClient;
const URI = process.env.MONGODB_URI;
const _db;

exports.mongoConnect = (callback)=>{
  MongoClient.connect(URI, {useNewUrlParser: true})
  .then(data =>{
    callback();
    _db = data.db();
    console.log('Connection to MongoDB successful');
  })
  .catch(err=>{
    console.log('Connection to MongoDB failed');
  });
}

exports.getDatabase = () =>{
  if(_db){
    return _db;
  }
  throw "No database found"
}

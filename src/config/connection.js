const mongoose = require('mongoose');
const config = require('./config');

exports.connection = () => {
  return mongoose.connect(config.mongoConnection, 
    {
      useNewUrlParser: true, 
      useUnifiedTopology: true,
      useCreateIndex: true,
      useFindAndModify: false
    }
  );
}

exports.testConnection = () => {
  return mongoose.connect(config.mongoTestConnection, 
    {
      useNewUrlParser: true, 
      useUnifiedTopology: true,
      useCreateIndex: true,
      useFindAndModify: false
    }
  );
}

exports.disconnectTest = () => {
  return mongoose.disconnect();
}
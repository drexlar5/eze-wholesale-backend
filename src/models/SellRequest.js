const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const sellRequestSchema = new Schema({
  storageSize: {
    type: String,
    required: true
  },
  condition: {
    type: String,
    required: true
  },
  price: {
    type: Number,
    required: true
  },
  deviceName: {
    type: String,
    required: true
  }
}).index({ storageSize: 'text', condition: 'text', price: 'text', deviceName: 'text' });

module.exports = mongoose.model('SellRequest', sellRequestSchema);
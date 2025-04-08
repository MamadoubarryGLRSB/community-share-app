const mongoose = require('mongoose');

const pointSchema = new mongoose.Schema({
  type: {
    type: String,
    enum: ['Point'],
    default: 'Point'
  },
  coordinates: {
    type: [Number],
    required: true
  }
});

const placeSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true
  },
  description: {
    type: String,
    required: true
  },
  address: String,
  location: {
    type: pointSchema,
    required: true
  },
  category: {
    type: String,
    enum: ['restaurant', 'bar', 'magasin', 'service', 'autre'],
    default: 'autre'
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

placeSchema.index({ location: '2dsphere' });

module.exports = mongoose.model('Place', placeSchema);

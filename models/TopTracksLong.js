const mongoose = require('mongoose');

const topTracksLongSchema = new mongoose.Schema({
    trackLongId: {
      type: String,
      required: true
    },
    userId: {
      type: String,
      required: true
    },
    trackLongName: {
      type: String,
      required: true
    },
    trackLongLink: {
      type: {String},
      required: true
    },
});

module.exports = mongoose.model('topTracksLong', topTracksLongSchema)

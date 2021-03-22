const mongoose = require('mongoose');

const topTracksShortSchema = new mongoose.Schema({
    trackShortId: {
      type: String,
      required: true
    },
    userId: {
      type: String,
      required: true
    },
    trackShortName: {
      type: String,
      required: true
    },
    trackShortLink: {
      type: {String},
      required: true
    },
});

module.exports = mongoose.model('topTracksShort', topTracksShortSchema)

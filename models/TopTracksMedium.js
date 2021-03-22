const mongoose = require('mongoose');

const topTracksMediumSchema = new mongoose.Schema({
    trackMediumId: {
      type: String,
      required: true
    },
    userId: {
      type: String,
      required: true
    },
    trackMediumName: {
      type: String,
      required: true
    },
    trackMediumLink: {
      type: {String},
      required: true
    },
});

module.exports = mongoose.model('topTracksMedium', topTracksMediumSchema)

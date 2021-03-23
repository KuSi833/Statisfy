const mongoose = require('mongoose');

const topArtistsMediumSchema = new mongoose.Schema({
    artistMediumId: {
      type: String,
      required: true
    },
    userId: {
      type: String,
      required: true
    },
    artistMediumName: {
      type: String,
      required: true
    },      type: String,

    artistMediumLink: {
      type: String,
      required: true
    },
    artistMediumGenres: {
      type: [String],
      required: true
    }
});

module.exports = mongoose.model('TopArtistsMedium', topArtistsMediumSchema)

const mongoose = require('mongoose');

const topArtistsShortSchema = new mongoose.Schema({
    artistShortId: {
      type: String,
      required: true
    },
    userId: {
      type: String,
      required: true
    },
    artistShortName: {
      type: String,
      required: true
    },
    artistShortLink: {
      type: String,
      required: true
    },
    artistShortGenres: {
      type: [String],
      required: true
    }
});

module.exports = mongoose.model('TopArtistsShort', topArtistsShortSchema)

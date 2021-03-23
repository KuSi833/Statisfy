const mongoose = require('mongoose');

const topArtistsLongSchema = new mongoose.Schema({
    artistLongId: {
      type: String,
      required: true
    },
    userId: {
      type: String,
      required: true
    },
    artistLongName: {
      type: String,
      required: true
    },
    artistLongLink: {
      type: String,
      required: true
    },
    artistLongGenres: {
      type: [String],
      required: true
    }
});

module.exports = mongoose.model('TopArtistsLong', topArtistsLongSchema)

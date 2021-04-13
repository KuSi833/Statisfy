const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema({
    spotifyId: {
        type: String,
        required: true
    },
    displayName: {
        type: String,
        required: true
    },
    accessToken: {
        type: String,
        required: true
    },
    refreshToken: {
        type: String,
        required: true
    },
    image: {
        type: String
    },
    createdAt: {
        type: Number,
    },
    averageAcousticness: {
        type: Number,
    },
    averageEnergy: {
        type: Number,
    },
    averageValence: {
        type: Number,
    },
    averageDanceability: {
        type: Number,
    },
    averageInstrumentalness: {
        type: Number,
    },
    averageLoudness: {
        type: Number,
    },
    averageTempo: {
        type: Number,
    },
    genres: {
      type: Array
    },
});

module.exports = mongoose.model('User', UserSchema)

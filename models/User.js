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
        type: Date,
        defualt: Date.now
    }
    
});

module.exports = mongoose.model('User', UserSchema)
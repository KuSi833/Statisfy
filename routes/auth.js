const express = require('express');
const passport = require('passport');
const router = express.Router();

// @desc    Auth with Spotify
// @route   GET /auth/spotify
router.get('/spotify', passport.authenticate('google', {
    scope: ['profile']
}));
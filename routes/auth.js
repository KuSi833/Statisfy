const express = require('express');
const passport = require('passport');
const router = express.Router();

// @desc    Auth with Spotify
// @route   GET /auth/spotify
router.get('/spotify', passport.authenticate('spotify', {
    scope: ['user-read-email', 'user-read-private', 'user-read-recently-played'],
    showDialog: true,
  })
);

// @desc    Google auth callback
// @route   GET /auth/google/callback
router.get(
    '/spotify/callback',
    passport.authenticate('spotify', {
        failureRedirect: '/',
    }),
    (req, res) => {
        res.redirect('/dashboard');
    }
);

module.exports = router;
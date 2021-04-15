const express = require('express');
const passport = require('passport');
const router = express.Router();

// @desc    Auth with Spotify
// @route   GET /auth/spotify
router.get('/spotify', passport.authenticate('spotify', {
    scope: ['user-read-email', 'user-read-private', 'user-read-recently-played', 'user-top-read', 'user-library-read', 'playlist-modify-private', 'playlist-modify-public', 'playlist-read-private', 'playlist-read-collaborative'],
    showDialog: true,
  })
);

// @desc    Google auth callback
// @route   GET /auth/spotify/callback
router.get(
    '/spotify/callback',
    passport.authenticate('spotify', {
        failureRedirect: '/',
    }),
    (req, res) => {
        res.redirect('/dashboard');
    }
);

// @desc    Logout user
// @route   /auth/logout
router.get('/logout', (req, res) => {
    req.logout();
    res.redirect('/');
})

module.exports = router;

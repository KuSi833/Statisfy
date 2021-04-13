const express = require('express');
const router = express.Router();
const { ensureAuth, ensureGuest } = require('../middleware/auth');

const User = require('../models/User');
const TopArtistsShort = require('../models/TopArtistsShort');
const TopArtistsMedium = require('../models/TopArtistsMedium');
const TopArtistsLong = require('../models/TopArtistsLong');
const TopTracksShort = require('../models/TopTracksShort');
const TopTracksMedium = require('../models/TopTracksMedium');
const TopTracksLong = require('../models/TopTracksLong');

// @desc    Login/Landing page
// @route   GET /
router.get('/', ensureGuest, (req, res) => {
    res.render('login', {
        layout: 'login',
    });
});

// @desc    About us page
// @route   GET /
router.get('/aboutus', (req, res) => {
    res.render('aboutus', {
        layout: 'main',
        aboutus: true,
        title: 'About us',
    });
});

router.get('/delete', (req, res) => {
    User.findOneAndRemove({spotifyId: req.user.spotifyId}, (error, dic) => {});
    TopArtistsShort.deleteMany({userId: req.user.spotifyId}, (error, dic) => {});
    TopArtistsMedium.deleteMany({userId: req.user.spotifyId}, (error, dic) => {});
    TopArtistsLong.deleteMany({userId: req.user.spotifyId}, (error, dic) => {});
    TopTracksShort.deleteMany({userId: req.user.spotifyId}, (error, dic) => {});
    TopTracksMedium.deleteMany({userId: req.user.spotifyId}, (error, dic) => {});
    TopTracksLong.deleteMany({userId: req.user.spotifyId}, (error, dic) => {});

    res.render('login', {
      layout: 'login',
    });
});

module.exports = router;

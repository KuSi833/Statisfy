const express = require('express');
const router = express.Router();
const { ensureAuth } = require('../middleware/auth');
const cache = require('../middleware/cache');
const pullData = require('../middleware/pullData');

// @desc    Dashboard
// @route   GET /dashboard
router.get('/', ensureAuth, cache, pullData, async (req, res) => {
    const spotifyInfo = req.spotifyInfo;

    var audioFeatures = [req.user.averageAcousticness, req.user.averageDanceability, req.user.averageEnergy, req.user.averageInstrumentalness, req.user.averageValence];
    audioFeatures = "[" + audioFeatures + "]"

    res.render('dashboard', {
        dashboard: true,
        title: 'Dashboard',
        audioFeatures,
        spotifyInfo,
    });
});

// @desc    Refresh
// @route   GET /
router.get('/refresh', pullData, (req, res) => {
    console.log("Refreshing");
    res.redirect('/dashboard');
});

module.exports = router;

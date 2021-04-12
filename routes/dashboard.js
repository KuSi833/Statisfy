const express = require('express');
const router = express.Router();
const { ensureAuth } = require('../middleware/auth');
const cache = require('../middleware/cache');
const pullData = require('../middleware/pullData');

// @desc    Dashboard
// @route   GET /dashboard
router.get('/', ensureAuth, cache, pullData, async (req, res) => {
    const spotifyInfo = req.spotifyInfo;

    const username = req.user.displayName;

    res.render('dashboard', {
        dashboard: true,
        title: 'Dashboard',
        username,
        spotifyInfo,
    });
});

// @desc    Refresh
// @route   GET /
router.get('/refresh', (req, res) => {
    console.log('test');

    res.render('dashboard', {
        dashboard: true,
        title: 'Dashboard',
        spotifyInfo,
    });
});

module.exports = router;

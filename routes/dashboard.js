const express = require('express');
const router = express.Router();
const { ensureAuth } = require('../middleware/auth');
const pullData = require('../middleware/pullData');

// @desc    Dashboard
// @route   GET /dashboard
router.get('/', ensureAuth, async (req, res) => {
    // res.render('loading', {
    //     layout: 'login',
    // });

    var spotifyInfo = await pullData(req, res);

    res.render('dashboard', {
        dashboard: true,
        title: 'Dashboard',
        spotifyInfo,
    });
});

module.exports = router;

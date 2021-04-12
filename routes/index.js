const express = require('express');
const router = express.Router();
const { ensureAuth, ensureGuest } = require('../middleware/auth');

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

module.exports = router;

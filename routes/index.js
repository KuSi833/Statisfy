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

// @desc    Login/Landing page
// @route   GET /
router.get('/aboutus', ensureGuest, (req, res) => {
    res.render('aboutus', {
        layout: 'main',
    });
});

module.exports = router;

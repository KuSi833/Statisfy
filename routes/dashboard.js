const express = require('express');
const router = express.Router();
const { ensureAuth } = require('../middleware/auth');
const SpotifyWebApi = require('spotify-web-api-node');

// @desc    Dashboard
// @route   GET /dashboard
router.get('/', ensureAuth, async (req, res) => {
    try {
        const spotifyApi = new SpotifyWebApi({
            accessToken: req.user.accessToken,
        });
        const topArtists = await (await spotifyApi.getMyTopArtists()).body.items;

        const spotifyInfo = {
            topArtists: topArtists,
        }
        
        res.render('dashboard', spotifyInfo);

    } catch (error) {
        console.log(error);
    }
});

module.exports = router;

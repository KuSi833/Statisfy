const express = require('express');
const router = express.Router();
const { ensureAuth } = require('../middleware/auth');
const cache = require('../middleware/cache');
const pullData = require('../middleware/pullData');

// @desc    Dashboard
// @route   GET /dashboard
router.get('/', ensureAuth, cache, pullData, async (req, res) => {
    const spotifyInfo = req.spotifyInfo;
    var audioFeatures = [
        req.user.averageAcousticness,
        req.user.averageDanceability,
        req.user.averageEnergy,
        req.user.averageInstrumentalness,
        req.user.averageValence,
    ];
    audioFeatures = '[' + audioFeatures + ']';

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
    console.log('Refreshing');
    res.redirect('/dashboard');
});

// router.get('/create', (req, res) => {
//   const userPlaylists = await ( await spotifyApi.getUserPlaylists() ).body.items;

//   let playlistId = null;
//   for (let item of userPlaylists) {
//     if (item.name == 'Top tracks - Statisfy') {
//       playlistId = item.id;
//       console.log(playlistId);
//       console.log("found playlist named top tracks");
//     }
//   }

//   if (playlistId) {
//     for (let item of topTracksShort) {
//       await spotifyApi.addTracksToPlaylist(playlistId, [item.uri]);
//     }
//   }
//   else {
//     const createPlaylist = await (
//         await spotifyApi.createPlaylist('Top tracks - Statisfy', {'description':
//         'Created by Statisfy', 'collaborative': 'false', 'public': 'true'})
//         ).body;
//         playlistId = createPlaylist.id;
//         for (let item of topTracksShort) {
//           await spotifyApi.addTracksToPlaylist(playlistId, [item.uri]);
//         }
//         console.log("created new playist");
//   }
// });

module.exports = router;

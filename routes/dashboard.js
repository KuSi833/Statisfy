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
        const topArtistsShort = await (await spotifyApi.getMyTopArtists({time_range: 'short_term'})).body.items;
        const topArtistsMedium = await (await spotifyApi.getMyTopArtists({time_range: 'medium_term'})).body.items;
        const topArtistsLong = await (await spotifyApi.getMyTopArtists({time_range: 'long_term'})).body.items;
        const topTracksShort = await (await spotifyApi.getMyTopTracks({time_range: 'long_term'})).body.items;
        const topTracksMedium = await (await spotifyApi.getMyTopTracks({time_range: 'long_term'})).body.items;
        const topTracksLong = await (await spotifyApi.getMyTopTracks({time_range: 'long_term'})).body.items;

        const spotifyInfo = {
            topArtistsShort: topArtistsShort,
            topArtistsMedium: topArtistsMedium,
            topArtistsLong: topArtistsLong,
            topTracksShort: topTracksShort,
            topTracksMedium: topTracksMedium,
            topTracksLong: topTracksLong,
        }

        res.render('dashboard', spotifyInfo);

    } catch (error) {
        console.log(error);
    }
});

module.exports = router;


//
// * Get the current user's top artists based on calculated affinity.
// * @param {Object} [options] Options, being time_range, limit, offset.
// * @param {requestCallback} [callback] Optional callback method to be called instead of the promise.
// * @returns {Promise|undefined} A promise that if successful, resolves into a paging object of artists,
// *          otherwise an error. Not returned if a callback is given.
// */
// getMyTopArtists: function(options, callback) {
//  return WebApiRequest.builder(this.getAccessToken())
//    .withPath('/v1/me/top/artists')
//    .withQueryParameters(options)
//    .build()
//    .execute(HttpManager.get, callback);
// },
//
// /* Get a User’s Top Tracks*/
// spotifyApi.getMyTopTracks()
//   .then(function(data) {
//     let topTracks = data.body.items;
//     console.log(topTracks);
//   }, function(err) {
//     console.log('Something went wrong!', err);
//   });

const express = require('express');
const router = express.Router();
const { ensureAuth } = require('../middleware/auth');
const SpotifyWebApi = require('spotify-web-api-node');

const TopArtistsShort = require('../models/TopArtistsShort');
const TopArtistsMedium = require('../models/TopArtistsMedium');
const TopArtistsLong = require('../models/TopArtistsLong');
const TopTracksShort = require('../models/TopTracksShort');
const TopTracksMedium = require('../models/TopTracksMedium');
const TopTracksLong = require('../models/TopTracksLong');

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
        const topTracksShort = await (await spotifyApi.getMyTopTracks({time_range: 'short_term'})).body.items;
        const topTracksMedium = await (await spotifyApi.getMyTopTracks({time_range: 'medium_term'})).body.items;
        const topTracksLong = await (await spotifyApi.getMyTopTracks({time_range: 'long_term'})).body.items;

        const spotifyInfo = {
            topArtistsShort: topArtistsShort,
            topArtistsMedium: topArtistsMedium,
            topArtistsLong: topArtistsLong,
            topTracksShort: topTracksShort,
            topTracksMedium: topTracksMedium,
            topTracksLong: topTracksLong,
        }


        for (item of topArtistsShort)
        {
          const newArtistShort = {
            artistShortId: item.id,
            userId: req.user.spotifyId,
            artistShortName: item.name,
            artistShortLink: item.href,
            artistShortGenres: item.genres,
          };
          var topArtistsS = await TopArtistsShort.findOne({
              artistShortId: item.id, userId: req.user.spotifyId,
          });
          if (topArtistsS) {
            continue;
          }
          else {
          topArtistsS = await TopArtistsShort.create(newArtistShort);
          }
        }

        for (item of topArtistsMedium)
        {
          const newArtistMedium = {
            artistMediumId: item.id,
            userId: req.user.spotifyId,
            artistMediumName: item.name,
            artistMediumLink: item.href,
            artistMediumGenres: item.genres,
          };
          var topArtistsM = await TopArtistsMedium.findOne({
              artistMediumId: item.id, userId: req.user.spotifyId,
          });
          if (topArtistsM) {
            continue;
          }
          else {
          topArtistsM = await TopArtistsMedium.create(newArtistMedium);
          }
        }

        for (item of topArtistsLong) {
          const newArtistLong = {
            artistLongId: item.id,
            userId: req.user.spotifyId,
            artistLongName: item.name,
            artistLongLink: item.href,
            artistLongGenres: item.genres,
          };
          var topArtistsL = await TopArtistsLong.findOne({
              artistLongId: item.id, userId: req.user.spotifyId,
          });
          if (topArtistsL) {
            continue;
          }
          else {
          topArtistsL = await TopArtistsLong.create(newArtistLong);
          }
        }

        for (item of topTracksShort) {
          const newTracksShort = {
            trackShortId: item.id,
            userId: req.user.spotifyId,
            trackShortName: item.name,
            trackShortLink: item.external_urls,
          };
          var topTracksS = await TopTracksShort.findOne({
              trackShortId: item.id, userId: req.user.spotifyId,
          });
          if (topTracksS) {
            continue;
          }
          else {
          topTracksS = await TopTracksShort.create(newTracksShort);
          }
        }

        for (item of topTracksMedium) {
          const newTracksMedium = {
            trackMediumId: item.id,
            userId: req.user.spotifyId,
            trackMediumName: item.name,
            trackMediumLink: item.external_urls,
          };
          var topTracksM = await TopTracksMedium.findOne({
              trackMediumId: item.id, userId: req.user.spotifyId,
          });
          if (topTracksM) {
            continue;
          }
          else {
          topTracksM = await TopTracksMedium.create(newTracksMedium);
          }
        }

        for (item of topTracksLong) {
          const newTracksLong = {
            trackLongId: item.id,
            userId: req.user.spotifyId,
            trackLongName: item.name,
            trackLongLink: item.external_urls,
          };
          var topTracksL = await TopTracksLong.findOne({
              trackLongId: item.id, userId: req.user.spotifyId,
          });
          if (topTracksL) {
            continue;
          }
          else {
          topTracksL = await TopTracksLong.create(newTracksLong);
          }
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

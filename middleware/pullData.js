const SpotifyWebApi = require('spotify-web-api-node');
const User = require('../models/User');

const TopArtistsShort = require('../models/TopArtistsShort');
const TopArtistsMedium = require('../models/TopArtistsMedium');
const TopArtistsLong = require('../models/TopArtistsLong');
const TopTracksShort = require('../models/TopTracksShort');
const TopTracksMedium = require('../models/TopTracksMedium');
const TopTracksLong = require('../models/TopTracksLong');

const pullData = async (req, res) => {
    try {
        const spotifyApi = new SpotifyWebApi({
            accessToken: req.user.accessToken,
        });

        spotifyApi.setRefreshToken(req.user.refreshToken);
        spotifyApi.setClientId(process.env.SPOTIFY_CLIENT_ID);
        spotifyApi.setClientSecret(process.env.SPOTIFY_CLIENT_SECRET);

        var date_in_ms = Date.now();
        await User.findOne(
            { spotifyId: req.user.spotifyId },
            function (err, obj) {
                if (date_in_ms - obj.createdAt > 3300000) {
                    spotifyApi.refreshAccessToken().then(
                        function (data) {
                            console.log('The access token has been refreshed!');
                            try {
                                var user = User.findOneAndUpdate(
                                    {
                                        spotifyId: req.user.spotifyId,
                                    },
                                    {
                                        accessToken: data.body['access_token'],
                                        createdAt: date_in_ms,
                                    },
                                    (error, doc) => {}
                                );
                            } catch (error) {
                                console.error(error);
                            }

                            spotifyApi.setAccessToken(
                                data.body['access_token']
                            );
                            console.log(user);
                        },
                        function (error) {
                            console.log('Could not refresh access token', err);
                        }
                    );
                }
            }
        );

        const topArtistsShort = await (
            await spotifyApi.getMyTopArtists({ time_range: 'short_term' })
        ).body.items;
        const topArtistsMedium = await (
            await spotifyApi.getMyTopArtists({ time_range: 'medium_term' })
        ).body.items;
        const topArtistsLong = await (
            await spotifyApi.getMyTopArtists({ time_range: 'long_term' })
        ).body.items;
        const topTracksShort = await (
            await spotifyApi.getMyTopTracks({ time_range: 'short_term' })
        ).body.items;
        const topTracksMedium = await (
            await spotifyApi.getMyTopTracks({ time_range: 'medium_term' })
        ).body.items;
        const topTracksLong = await (
            await spotifyApi.getMyTopTracks({ time_range: 'long_term' })
        ).body.items;

        const spotifyInfo = {
            topArtistsShort,
            topArtistsMedium,
            topArtistsLong,
            topTracksShort,
            topTracksMedium,
            topTracksLong,
        };

        for (var item of topArtistsShort) {
            const newArtistShort = {
                artistShortId: item.id,
                userId: req.user.spotifyId,
                artistShortName: item.name,
                artistShortLink: item.href,
                artistShortGenres: item.genres,
            };
            var topArtistsS = await TopArtistsShort.findOne({
                artistShortId: item.id,
                userId: req.user.spotifyId,
            });
            if (topArtistsS) {
                continue;
            } else {
                topArtistsS = await TopArtistsShort.create(newArtistShort);
            }
        }

        for (item of topArtistsMedium) {
            const newArtistMedium = {
                artistMediumId: item.id,
                userId: req.user.spotifyId,
                artistMediumName: item.name,
                artistMediumLink: item.href,
                artistMediumGenres: item.genres,
            };
            var topArtistsM = await TopArtistsMedium.findOne({
                artistMediumId: item.id,
                userId: req.user.spotifyId,
            });
            if (topArtistsM) {
                continue;
            } else {
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
                artistLongId: item.id,
                userId: req.user.spotifyId,
            });
            if (topArtistsL) {
                continue;
            } else {
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
                trackShortId: item.id,
                userId: req.user.spotifyId,
            });
            if (topTracksS) {
                continue;
            } else {
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
                trackMediumId: item.id,
                userId: req.user.spotifyId,
            });
            if (topTracksM) {
                continue;
            } else {
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
                trackLongId: item.id,
                userId: req.user.spotifyId,
            });
            if (topTracksL) {
                continue;
            } else {
                topTracksL = await TopTracksLong.create(newTracksLong);
            }
        }

        return spotifyInfo;
    } catch (error) {
        console.log(error);
    }
};

module.exports = pullData;

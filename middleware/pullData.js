const SpotifyWebApi = require('spotify-web-api-node');
const User = require('../models/User');

const TopArtistsShort = require('../models/TopArtistsShort');
const TopArtistsMedium = require('../models/TopArtistsMedium');
const TopArtistsLong = require('../models/TopArtistsLong');
const TopTracksShort = require('../models/TopTracksShort');
const TopTracksMedium = require('../models/TopTracksMedium');
const TopTracksLong = require('../models/TopTracksLong');

const redis = require('redis');
const client = redis.createClient(process.env.REDIS_PORT);

const pullData = async (req, res, next) => {
    if (req.spotifyInfo === null || req.spotifyInfo === undefined) {
        // Only pull data if it isn't already in cache
        console.log('No data found in cache...');
        console.log('Getting data from MongoDB');
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
                                console.log(
                                    'The access token has been refreshed!'
                                );
                                try {
                                    var user = User.findOneAndUpdate(
                                        {
                                            spotifyId: req.user.spotifyId,
                                        },
                                        {
                                            accessToken:
                                                data.body['access_token'],
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
                                console.log(
                                    'Could not refresh access token',
                                    err
                                );
                            }
                        );
                    }
                }
            );

            const topArtistsShort = await (
                await spotifyApi.getMyTopArtists({
                    time_range: 'short_term',
                    limit: '5',
                })
            ).body.items;
            const topArtistsMedium = await (
                await spotifyApi.getMyTopArtists({
                    time_range: 'medium_term',
                    limit: '5',
                })
            ).body.items;
            const topArtistsLong = await (
                await spotifyApi.getMyTopArtists({
                    time_range: 'long_term',
                    limit: '5',
                })
            ).body.items;
            const topTracksShort = await (
                await spotifyApi.getMyTopTracks({
                    time_range: 'short_term',
                    limit: '5',
                })
            ).body.items;
            const topTracksMedium = await (
                await spotifyApi.getMyTopTracks({
                    time_range: 'medium_term',
                    limit: '5',
                })
            ).body.items;
            const topTracksLong = await (
                await spotifyApi.getMyTopTracks({
                    time_range: 'long_term',
                    limit: '5',
                })
            ).body.items;

            var genres = [];
            const allTopArtistsMedium = await (
                await spotifyApi.getMyTopArtists({ time_range: 'medium_term' })
            ).body.items;
            for (var item of allTopArtistsMedium) {
                for (var genre of item.genres) {
                    var index = genres.indexOf(genre);
                    if (index == -1) {
                        genres.push(genre);
                        genres.push(1);
                    } else {
                        genres[index + 1] += 1;
                    }
                }
            }

            const allTopTracksMedium = await (
                await spotifyApi.getMyTopTracks({ time_range: 'medium_term' })
            ).body.items;
            var averageDanceability = 0;
            var averageAcousticness = 0;
            var averageEnergy = 0;
            var averageInstrumentalness = 0;
            var averageValence = 0;
            for (var item of allTopTracksMedium) {
                const audioFeatures = await spotifyApi.getAudioFeaturesForTrack(
                    item.id
                );
                averageDanceability =
                    averageDanceability + audioFeatures.body.danceability;
                averageAcousticness =
                    averageAcousticness + audioFeatures.body.acousticness;
                averageEnergy = averageEnergy + audioFeatures.body.acousticness;
                averageInstrumentalness =
                    averageInstrumentalness +
                    audioFeatures.body.instrumentalness;
                averageValence = averageValence + audioFeatures.body.valence;
            }
            averageDanceability =
                averageDanceability / allTopTracksMedium.length;
            averageAcousticness =
                averageAcousticness / allTopTracksMedium.length;
            averageEnergy = averageEnergy / allTopTracksMedium.length;
            averageInstrumentalness =
                averageInstrumentalness / allTopTracksMedium.length;
            averageValence = averageValence / allTopTracksMedium.length;

            var Features = User.findOneAndUpdate(
                {
                    spotifyId: req.user.spotifyId,
                },
                {
                    averageAcousticness: averageAcousticness,
                    averageEnergy: averageEnergy,
                    averageValence: averageValence,
                    averageDanceability: averageDanceability,
                    averageInstrumentalness: averageInstrumentalness,
                    genres: genres,
                },
                (error, doc) => {}
            );


            const recommendationsA =await (
                await spotifyApi.getRecommendations({ seed_artists: [topArtistsShort[0].id, topArtistsShort[1].id, topArtistsShort[2].id, topArtistsShort[3].id, topArtistsShort[4].id], limit: '5' })).body.tracks;

                console.log(recommendationsA[0].artists[0].name);

            const user = await spotifyApi.getMe();
            const country = user.body.country;
            const name = user.body.display_name;
            const url = user.body.external_urls.spotify;
            const product = user.body.product;
            const email = user.body.email;

            const spotifyInfo = {
                topArtistsShort,
                topArtistsMedium,
                topArtistsLong,
                topTracksShort,
                topTracksMedium,
                topTracksLong,
                country,
                name,
                url,
                product,
                email,
                recommendationsA,
            };

            for (var item of topArtistsShort) {
                const newArtistShort = {
                    artistShortId: item.id,
                    userId: req.user.spotifyId,
                    artistShortName: item.name,
                    artistShortLink: item.href,
                    artistShortGenres: item.genres,
                };
            }

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
                    topArtistsM = await TopArtistsMedium.create(
                        newArtistMedium
                    );
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
            req.spotifyInfo = spotifyInfo;

            // Set data to Redis (caching)
            client.hset(
                'spotify_data',
                req.user.spotifyId,
                JSON.stringify(spotifyInfo)
            );
        } catch (error) {
            console.log(error);
        }
    }
    next();
};

module.exports = pullData;

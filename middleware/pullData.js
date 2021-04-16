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

// Handlebars helpers
const intArrayToString = (list) => {
    return '[' + list + ']';
};
const stringArrayToString = (list) => {
    let returnString = '[';
    for (let element of list) {
        returnString += "'" + element + "',";
    }
    returnString = returnString.slice(0, -1);
    returnString += ']';
    return returnString;
};

// Genres
const getGenres = async (spotifyApi) => {
    const allTopArtistsMedium = await (
        await spotifyApi.getMyTopArtists({ time_range: 'medium_term' })
    ).body.items;
    let genresDict = {};
    for (let item of allTopArtistsMedium) {
        for (let genre of item.genres) {
            if (genre in genresDict) {
                genresDict[genre] += 1;
            } else {
                genresDict[genre] = 1;
            }
        }
    }
    return genresDict;
};
const dictToArray = (dictionary) => {
    let returnArray = [];
    for (let key in dictionary) {
        if (dictionary.hasOwnProperty(key)) {
            returnArray.push([key, dictionary[key]]);
        }
    }
    return returnArray;
};
let labelsArray = [];
const getTopGenresChartData = (genresArray, n) => {
    // Returns labels and data for top genres chart
    let labels = [];
    let data = [];
    let total_value = 0;
    for (let i = 0; i < n; i++) {
        let genre;
        let value;
        [genre, value] = genresArray[i];
        labels.push(genre);
        total_value += value;
    }
    for (let i = 0; i < n; i++) {
        let value;
        value = genresArray[i][1];
        data.push((value * 100) / total_value);
    }

    labelsArray = labels;
    labels = stringArrayToString(labels);
    data = intArrayToString(data);
    let topGenresChartData = {
        labels,
        data,
    };

    return topGenresChartData;
};

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

            let date_in_ms = Date.now();
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
                                    User.findOneAndUpdate(
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
                    limit: '20',
                })
            ).body.items;
            const topArtistsMedium = await (
                await spotifyApi.getMyTopArtists({
                    time_range: 'medium_term',
                    limit: '20',
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
                    limit: '20',
                })
            ).body.items;
            const topTracksMedium = await (
                await spotifyApi.getMyTopTracks({
                    time_range: 'medium_term',
                    limit: '20',
                })
            ).body.items;
            const topTracksLong = await (
                await spotifyApi.getMyTopTracks({
                    time_range: 'long_term',
                    limit: '5',
                })
            ).body.items;

            const userPlaylists = await (await spotifyApi.getUserPlaylists())
                .body.items;

            let playlistId = null;
            for (let item of userPlaylists) {
                if (item.name == 'Top tracks - Statisfy') {
                    playlistId = item.id;
                    // console.log(playlistId);
                    console.log('found playlist named top tracks');
                }
            }

            if (playlistId) {
                for (let item of topTracksShort) {
                    await spotifyApi.addTracksToPlaylist(playlistId, [
                        item.uri,
                    ]);
                }
            } else {
                const createPlaylist = await (
                    await spotifyApi.createPlaylist('Top tracks - Statisfy', {
                        description: 'Created by Statisfy',
                        collaborative: 'false',
                        public: 'true',
                    })
                ).body;
                playlistId = createPlaylist.id;
                for (let item of topTracksShort) {
                    await spotifyApi.addTracksToPlaylist(playlistId, [
                        item.uri,
                    ]);
                }
                console.log('created new playist');
            }

            const recentlyPlayed = await (
                await spotifyApi.getMyRecentlyPlayedTracks()
            ).body.items;

            // Getting Genres
            const genresDict = await getGenres(spotifyApi);
            let genresArray = dictToArray(genresDict).sort(
                (key, value) => value[1] - key[1]
            );
            // Getting genres data for chart
            let topGenresChartData = getTopGenresChartData(genresArray, 6);

            const allTopTracksMedium = await (
                await spotifyApi.getMyTopTracks({ time_range: 'medium_term' })
            ).body.items;
            let averageDanceability = 0;
            let averageAcousticness = 0;
            let averageEnergy = 0;
            let averageInstrumentalness = 0;
            let averageValence = 0;
            let averageLoudness = 0;
            let averageTempo = 0;
            for (let item of allTopTracksMedium) {
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
                averageLoudness = averageLoudness + audioFeatures.body.loudness;
                averageTempo = averageTempo + audioFeatures.body.tempo;
            }
            averageDanceability =
                averageDanceability / allTopTracksMedium.length;
            averageAcousticness =
                averageAcousticness / allTopTracksMedium.length;
            averageEnergy = averageEnergy / allTopTracksMedium.length;
            averageInstrumentalness =
                averageInstrumentalness / allTopTracksMedium.length;
            averageValence = averageValence / allTopTracksMedium.length;
            averageLoudness = averageLoudness / allTopTracksMedium.length;
            averageTempo = averageTempo / allTopTracksMedium.length;

            User.findOneAndUpdate(
                {
                    spotifyId: req.user.spotifyId,
                },
                {
                    averageAcousticness: averageAcousticness,
                    averageEnergy: averageEnergy,
                    averageValence: averageValence,
                    averageDanceability: averageDanceability,
                    averageInstrumentalness: averageInstrumentalness,
                    averageLoudness: averageLoudness,
                    averageTempo: averageTempo,
                    genres: genresArray,
                },
                (error, doc) => {}
            );

            let seed_artists = [];
            for (let artist of topArtistsLong) {
                seed_artists.push(artist.id);
            }

            let seed_tracks = [];
            for (let track of topTracksLong) {
                seed_tracks.push(track.id);
            }

            // let topGenres = getTopGenresChartData(genresArray, 5);  WTF IS THIS
            let seed_genres = genresArray[0].splice(0, 5);

            const recommendationsA = await (
                await spotifyApi.getRecommendations({
                    seed_artists: seed_artists,
                    limit: '10',
                })
            ).body.tracks;

            const recommendationsT = await (
                await spotifyApi.getRecommendations({
                    seed_tracks: seed_tracks,
                    limit: '10',
                })
            ).body.tracks;

            const recommendationsG = await (
                await spotifyApi.getRecommendations({
                    seed_genres: seed_genres,
                    limit: '10',
                })
            ).body.tracks;

            const spotifyUser = await spotifyApi.getMe();
            const name = spotifyUser.body.display_name;
            const image = spotifyUser.body.images[0];
            const country = spotifyUser.body.country;
            const url = spotifyUser.body.external_urls.spotify;
            const product = spotifyUser.body.product;
            const email = spotifyUser.body.email;
            const followers = spotifyUser.body.followers.total;

            const userData = {
                name,
                image,
                country,
                url,
                product,
                email,
                followers,
            };

            const spotifyInfo = {
                topArtistsShort,
                topArtistsMedium,
                topArtistsLong,
                topTracksShort,
                topTracksMedium,
                topTracksLong,
                genresArray,
                topGenresChartData,
                userData,
                recommendationsA,
                recommendationsT,
                recommendationsG,
            };

            for (let item of topArtistsShort) {
                const newArtistShort = {
                    artistShortId: item.id,
                    userId: req.user.spotifyId,
                    artistShortName: item.name,
                    artistShortLink: item.href,
                    artistShortGenres: item.genres,
                };
                let topArtistsS = await TopArtistsShort.findOne({
                    artistShortId: item.id,
                    userId: req.user.spotifyId,
                });
                if (topArtistsS) {
                    continue;
                } else {
                    topArtistsS = await TopArtistsShort.create(newArtistShort);
                }
            }

            for (let item of topArtistsMedium) {
                const newArtistMedium = {
                    artistMediumId: item.id,
                    userId: req.user.spotifyId,
                    artistMediumName: item.name,
                    artistMediumLink: item.href,
                    artistMediumGenres: item.genres,
                };
                let topArtistsM = await TopArtistsMedium.findOne({
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

            for (let item of topArtistsLong) {
                const newArtistLong = {
                    artistLongId: item.id,
                    userId: req.user.spotifyId,
                    artistLongName: item.name,
                    artistLongLink: item.href,
                    artistLongGenres: item.genres,
                };
                let topArtistsL = await TopArtistsLong.findOne({
                    artistLongId: item.id,
                    userId: req.user.spotifyId,
                });
                if (topArtistsL) {
                    continue;
                } else {
                    topArtistsL = await TopArtistsLong.create(newArtistLong);
                }
            }

            for (let item of topTracksShort) {
                const newTracksShort = {
                    trackShortId: item.id,
                    userId: req.user.spotifyId,
                    trackShortName: item.name,
                    trackShortLink: item.external_urls,
                };
                let topTracksS = await TopTracksShort.findOne({
                    trackShortId: item.id,
                    userId: req.user.spotifyId,
                });
                if (topTracksS) {
                    continue;
                } else {
                    topTracksS = await TopTracksShort.create(newTracksShort);
                }
            }

            for (let item of topTracksMedium) {
                const newTracksMedium = {
                    trackMediumId: item.id,
                    userId: req.user.spotifyId,
                    trackMediumName: item.name,
                    trackMediumLink: item.external_urls,
                };
                let topTracksM = await TopTracksMedium.findOne({
                    trackMediumId: item.id,
                    userId: req.user.spotifyId,
                });
                if (topTracksM) {
                    continue;
                } else {
                    topTracksM = await TopTracksMedium.create(newTracksMedium);
                }
            }

            for (let item of topTracksLong) {
                const newTracksLong = {
                    trackLongId: item.id,
                    userId: req.user.spotifyId,
                    trackLongName: item.name,
                    trackLongLink: item.external_urls,
                };
                let topTracksL = await TopTracksLong.findOne({
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

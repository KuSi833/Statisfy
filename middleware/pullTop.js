const SpotifyWebApi = require('spotify-web-api-node');

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

const pullTop = async (req, res, next) => {
  const spotifyApi = new SpotifyWebApi({
      accessToken: req.user.accessToken,
  });
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

  let seed_artists = [];
  for (let artist of topArtistsLong) {
      seed_artists.push(artist.id);
  }

  let seed_tracks = [];
  for (let track of topTracksLong) {
      seed_tracks.push(track.id);
  };
  const genresDict = await getGenres(spotifyApi);
  let genresArray = dictToArray(genresDict).sort(
      (key, value) => value[1] - key[1]
  );

  let seed_genres = genresArray[0].splice(0, 5);

  const recommendationsA = await (
      await spotifyApi.getRecommendations({
          seed_artists: seed_artists,
          limit: '20',
      })
  ).body.tracks;

  const recommendationsT = await (
      await spotifyApi.getRecommendations({
          seed_tracks: seed_tracks,
          limit: '20',
      })
  ).body.tracks;

  const recommendationsG = await (
      await spotifyApi.getRecommendations({
          seed_genres: seed_genres,
          limit: '20',
      })
  ).body.tracks;

  const topInfo = {
    topArtistsShort,
    topArtistsMedium,
    topArtistsLong,
    topTracksShort,
    topTracksMedium,
    topTracksLong,
    recommendationsA,
    recommendationsG,
    recommendationsT,
  };

  req.topInfo = topInfo;
  next();
};



module.exports = pullTop;

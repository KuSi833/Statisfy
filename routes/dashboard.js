const express = require('express');
const router = express.Router();
const { ensureAuth } = require('../middleware/auth');
const cache = require('../middleware/cache');
const pullData = require('../middleware/pullData');
const pullTop = require('../middleware/pullTop');

const SpotifyWebApi = require('spotify-web-api-node');


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

    console.log(spotifyInfo.genresArray)

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

router.get('/createST', pullTop, async (req, res) => {
  const spotifyApi = new SpotifyWebApi({
      accessToken: req.user.accessToken,
  });
  const userPlaylists = await ( await spotifyApi.getUserPlaylists() ).body.items;

  let playlistId = null;
  for (let item of userPlaylists) {
    if (item.name == 'Top tracks short term - Statisfy') {
      playlistId = item.id;
      console.log(playlistId);
      console.log("found playlist named top tracks short");
    }
  };
  let found = false;
  if (playlistId) {
    let playlistItems = await (
      await spotifyApi.getPlaylistTracks(playlistId)
    ).body.items;
    for (let item of req.topInfo.topTracksShort) {
      for (let tracks of playlistItems) {
        if (tracks.track.uri == item.uri) {
          found = true;
        };
      };
      if (found == false) {
        await spotifyApi.addTracksToPlaylist(playlistId, [item.uri]);
        console.log("Added song");
      };
    };
  }
  else {
    const createPlaylist = await (
        await spotifyApi.createPlaylist('Top tracks short term - Statisfy', {'description':
        'Created by Statisfy from your top tracks in the last month', 'collaborative': 'false', 'public': 'true'})
        ).body;
        playlistId = createPlaylist.id;
        for (let item of req.topInfo.topTracksShort) {
          await spotifyApi.addTracksToPlaylist(playlistId, [item.uri]);
        }
        console.log("created new playist");
  };
  res.redirect('/dashboard');
});
router.get('/createMT', pullTop, async (req, res) => {
  const spotifyApi = new SpotifyWebApi({
      accessToken: req.user.accessToken,
  });
  const userPlaylists = await ( await spotifyApi.getUserPlaylists() ).body.items;

  let playlistId = null;
  for (let item of userPlaylists) {
    if (item.name == 'Top tracks medium term - Statisfy') {
      playlistId = item.id;
      console.log(playlistId);
      console.log("found playlist named top tracks medium");
    }
  };
  let found = false;
  if (playlistId) {
    let playlistItems = await (
      await spotifyApi.getPlaylistTracks(playlistId)
    ).body.items;
    for (let item of req.topInfo.topTracksMedium) {
      for (let tracks of playlistItems) {
        if (tracks.track.uri == item.uri) {
          found = true;
        };
      };
      if (found == false) {
        await spotifyApi.addTracksToPlaylist(playlistId, [item.uri]);
        console.log("Added song");
      };
    };
  }
  else {
    const createPlaylist = await (
        await spotifyApi.createPlaylist('Top tracks medium term - Statisfy', {'description':
        'Created by Statisfy from your top tracks in the last 6 months', 'collaborative': 'false', 'public': 'true'})
        ).body;
        playlistId = createPlaylist.id;
        for (let item of req.topInfo.topTracksMedium) {
          await spotifyApi.addTracksToPlaylist(playlistId, [item.uri]);
        }
        console.log("created new playist");
  };
  res.redirect('/dashboard');
});
router.get('/createLT', pullTop, async (req, res) => {
  const spotifyApi = new SpotifyWebApi({
      accessToken: req.user.accessToken,
  });
  const userPlaylists = await ( await spotifyApi.getUserPlaylists() ).body.items;

  let playlistId = null;
  for (let item of userPlaylists) {
    if (item.name == 'Top tracks long term - Statisfy') {
      playlistId = item.id;
      console.log(playlistId);
      console.log("found playlist named top tracks long");
    }
  };
  let found = false;
  if (playlistId) {
    let playlistItems = await (
      await spotifyApi.getPlaylistTracks(playlistId)
    ).body.items;
    for (let item of req.topInfo.topTracksLong) {
      for (let tracks of playlistItems) {
        if (tracks.track.uri == item.uri) {
          found = true;
        };
      };
      if (found == false) {
        await spotifyApi.addTracksToPlaylist(playlistId, [item.uri]);
        console.log("Added song");
      };
    };
  }
  else {
    const createPlaylist = await (
        await spotifyApi.createPlaylist('Top tracks long term - Statisfy', {'description':
        'Created by Statisfy from your top tracks in the last years', 'collaborative': 'false', 'public': 'true'})
        ).body;
        playlistId = createPlaylist.id;
        for (let item of req.topInfo.topTracksLong) {
          await spotifyApi.addTracksToPlaylist(playlistId, [item.uri]);
        }
        console.log("created new playist");
  };
  res.redirect('/dashboard');
});
router.get('/createAR', pullTop, async (req, res) => {
  const spotifyApi = new SpotifyWebApi({
      accessToken: req.user.accessToken,
  });
  const userPlaylists = await ( await spotifyApi.getUserPlaylists() ).body.items;

  let playlistId = null;
  for (let item of userPlaylists) {
    if (item.name == 'Recommendations from top artists - Statisfy') {
      playlistId = item.id;
      console.log(playlistId);
      console.log("found playlist named recommendations artists");
    }
  };
  let found = false;
  if (playlistId) {
    let playlistItems = await (
      await spotifyApi.getPlaylistTracks(playlistId)
    ).body.items;
    for (let item of req.topInfo.recommendationsA) {
      for (let tracks of playlistItems) {
        if (tracks.track.uri == item.uri) {
          found = true;
        };
      };
      if (found == false) {
        await spotifyApi.addTracksToPlaylist(playlistId, [item.uri]);
        console.log("Added song");
      };
    };
  }
  else {
    const createPlaylist = await (
        await spotifyApi.createPlaylist('Recommendations from top artists - Statisfy', {'description':
        'Created by Statisfy from recommendations based on your top artists', 'collaborative': 'false', 'public': 'true'})
        ).body;
        playlistId = createPlaylist.id;
        for (let item of req.topInfo.recommendationsA) {
          await spotifyApi.addTracksToPlaylist(playlistId, [item.uri]);
        }
        console.log("created new playist");
  };
  res.redirect('/dashboard');
});
router.get('/createTR', pullTop, async (req, res) => {
  const spotifyApi = new SpotifyWebApi({
      accessToken: req.user.accessToken,
  });
  const userPlaylists = await ( await spotifyApi.getUserPlaylists() ).body.items;

  let playlistId = null;
  for (let item of userPlaylists) {
    if (item.name == 'Recommendations from top tracks - Statisfy') {
      playlistId = item.id;
      console.log(playlistId);
      console.log("found playlist named recommendations tracks");
    }
  };
  let found = false;
  if (playlistId) {
    let playlistItems = await (
      await spotifyApi.getPlaylistTracks(playlistId)
    ).body.items;
    for (let item of req.topInfo.recommendationsT) {
      for (let tracks of playlistItems) {
        if (tracks.track.uri == item.uri) {
          found = true;
        };
      };
      if (found == false) {
        await spotifyApi.addTracksToPlaylist(playlistId, [item.uri]);
        console.log("Added song");
      };
    };
  }
  else {
    const createPlaylist = await (
        await spotifyApi.createPlaylist('Recommendations from top tracks - Statisfy', {'description':
        'Created by Statisfy from recommendations based on your top tracks', 'collaborative': 'false', 'public': 'true'})
        ).body;
        playlistId = createPlaylist.id;
        for (let item of req.topInfo.recommendationsT) {
          await spotifyApi.addTracksToPlaylist(playlistId, [item.uri]);
        }
        console.log("created new playist");
  };
  res.redirect('/dashboard');
});
router.get('/createGR', pullTop, async (req, res) => {
  const spotifyApi = new SpotifyWebApi({
      accessToken: req.user.accessToken,
  });
  const userPlaylists = await ( await spotifyApi.getUserPlaylists() ).body.items;

  let playlistId = null;
  for (let item of userPlaylists) {
    if (item.name == 'Recommendations from top genres - Statisfy') {
      playlistId = item.id;
      console.log(playlistId);
      console.log("found playlist named recommendations genres");
    }
  };
  let found = false;
  if (playlistId) {
    let playlistItems = await (
      await spotifyApi.getPlaylistTracks(playlistId)
    ).body.items;
    for (let item of req.topInfo.recommendationsG) {
      for (let tracks of playlistItems) {
        if (tracks.track.uri == item.uri) {
          found = true;
        };
      };
      if (found == false) {
        await spotifyApi.addTracksToPlaylist(playlistId, [item.uri]);
        console.log("Added song");
      };
    };
  }
  else {
    const createPlaylist = await (
        await spotifyApi.createPlaylist('Recommendations from top genres - Statisfy', {'description':
        'Created by Statisfy from recommendations based on your top genres', 'collaborative': 'false', 'public': 'true'})
        ).body;
        playlistId = createPlaylist.id;
        for (let item of req.topInfo.recommendationsG) {
          await spotifyApi.addTracksToPlaylist(playlistId, [item.uri]);
        }
        console.log("created new playist");
  };
  res.redirect('/dashboard');
});

module.exports = router;

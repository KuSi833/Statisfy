/*
 * This is an example of a basic node.js script that performs
 * the Authorization Code oAuth2 flow to authenticate against
 * the Spotify Accounts.
 *
 * For more information, read
 * https://developer.spotify.com/web-api/authorization-guide/#authorization_code_flow
 */

var express = require('express'); // Express web server framework
var request = require('request'); // "Request" library
var cors = require('cors');
var querystring = require('querystring');
var cookieParser = require('cookie-parser');

var client_id = '70d24c0309de4c80a3f869782e9e795a'; // Your client id
var client_secret = 'c423757044294404b3f51741c7e1676f'; // Your secret
var redirect_uri = 'http://localhost:8888/callback'; // Your redirect uri

/**
 * Generates a random string containing numbers and letters
 * @param  {number} length The length of the string
 * @return {string} The generated string
 */
var generateRandomString = function(length) {
  var text = '';
  var possible = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';

  for (var i = 0; i < length; i++) {
    text += possible.charAt(Math.floor(Math.random() * possible.length));
  }
  return text;
};

var stateKey = 'spotify_auth_state';

var app = express();

app.use(express.static(__dirname + '/public'))
   .use(cors())
   .use(cookieParser());

// app.set('views', __dirname + '/public');
// app.engine('html', require('ejs').renderFile);
// app.set('view engine', 'html');
//
// app.get('/dashboard', function(req, res) {
//
//      res.render('dashboard.html');
 // });
app.get('/login', function(req, res) {

  var state = generateRandomString(16);
  res.cookie(stateKey, state);

  // your application requests authorization
  var scope = 'user-read-private user-read-email user-top-read user-library-read user-read-recently-played';
  res.redirect('https://accounts.spotify.com/authorize?' +
    querystring.stringify({
      response_type: 'code',
      client_id: client_id,
      scope: scope,
      redirect_uri: redirect_uri,
      state: state
    }));
});

app.get('/callback', function(req, res) {

  // your application requests refresh and access tokens
  // after checking the state parameter
  var code = req.query.code || null;
  var state = req.query.state || null;
  var storedState = req.cookies ? req.cookies[stateKey] : null;

  if (state === null || state !== storedState) {
    res.redirect('/#' +
      querystring.stringify({
        error: 'state_mismatch'
      }));
  } else {
    res.clearCookie(stateKey);
    var authOptions = {
      url: 'https://accounts.spotify.com/api/token',
      form: {
        code: code,
        redirect_uri: redirect_uri,
        grant_type: 'authorization_code'
      },
      headers: {
        'Authorization': 'Basic ' + (new Buffer(client_id + ':' + client_secret).toString('base64'))
      },
      json: true
    };

    request.post(authOptions, function(error, response, body) {
      if (!error && response.statusCode === 200) {

        var access_token = body.access_token,
            refresh_token = body.refresh_token;


        var artists_short = {
          	url: "https://api.spotify.com/v1/me/top/artists?time_range=short_term",
          	headers: { 'Authorization': 'Bearer ' + access_token },
          	json: true
        };
        var artists_medium = {
          	url: "https://api.spotify.com/v1/me/top/artists?time_range=medium_term",
          	headers: { 'Authorization': 'Bearer ' + access_token },
          	json: true
        };
        var artists_long = {
          	url: "https://api.spotify.com/v1/me/top/artists?time_range=long_term",
          	headers: { 'Authorization': 'Bearer ' + access_token },
          	json: true
        };


        var tracks_short = {
          	url: "https://api.spotify.com/v1/me/top/tracks?time_range=short_term",
          	headers: { 'Authorization': 'Bearer ' + access_token },
         	json: true
        };
        var tracks_medium = {
          	url: "https://api.spotify.com/v1/me/top/tracks?time_range=medium_term",
          	headers: { 'Authorization': 'Bearer ' + access_token },
         	json: true
        };
        var tracks_long = {
        	url: "https://api.spotify.com/v1/me/top/tracks?time_range=long_term",
	        headers: { 'Authorization': 'Bearer ' + access_token },
	        json: true
        };


        var saved_albums = {
        	url: "https://api.spotify.com/v1/me/albums",
          	headers: { 'Authorization': 'Bearer ' + access_token },
          	json: true
        };
        var saved_tracks = {
        	url: "https://api.spotify.com/v1/me/tracks",
          	headers: { 'Authorization': 'Bearer ' + access_token },
          	json: true
        };


        var recently_played = {
        	url: "https://api.spotify.com/v1/me/player/recently-played",
          	headers: { 'Authorization': 'Bearer ' + access_token },
          	json: true
        };


        // use the access token to access the Spotify Web API

        request.get(artists_short, function(error, response, body) {
           	console.log("Top artists(short term)");
          	for(item of body.items){
          		console.log(item.name);
         	 }
          	console.log("\n\n")
      		});
        request.get(artists_medium, function(error, response, body) {
           	console.log("Top artists(medium term)");
          	for(item of body.items){
          		console.log(item.name);
          	}
          	console.log("\n\n")
      		});
        request.get(artists_long, function(error, response, body) {
           	console.log("Top artists(long term)");
          	for(item of body.items){
          		console.log(item.name);
         	}
         	console.log("\n\n")
         	});


        request.get(tracks_short, function(error, response, body) {
           	console.log("Top tracks(short term)");
	        for(item of body.items){
	        	console.log(item.name);
	         }
         	console.log("\n\n");
      		});
        request.get(tracks_medium, function(error, response, body) {
           	console.log("Top tracks(medium term)");
          	for(item of body.items){
          		console.log(item.name);
          	}
          	console.log("\n\n");
      		});
        request.get(tracks_long, function(error, response, body) {
           	console.log("Top tracks(long term)");
          	for(item of body.items){
          		console.log(item.name);
         	}
         	console.log("\n\n");
         	});


        request.get(saved_albums, function(error, response, body) {
        	console.log("<=20 saved albums");
        	for(item of body.items) {
        		console.log(item.album.name)
        	}
        	console.log("\n\n");
        });
        request.get(saved_tracks, function(error, response, body) {
        	console.log("<=20 saved tracks");
        	for(item of body.items) {
        		console.log(item.track.name)
        	}
        	console.log("\n\n");
        });


        request.get(recently_played, function(error, response, body) {
        	console.log("Recently played tracks (20 by default)");
        	for(item of body.items) {
        		console.log(item.track.name)
        	}
        	console.log("\n\n")
        })

        // we can also pass the token to the browser to make requests from there
        res.redirect('/#' +
          querystring.stringify({
            access_token: access_token,
            refresh_token: refresh_token
          }));
      } else {
        res.redirect('/#' +
          querystring.stringify({
            error: 'invalid_token'
          }));
      }
    });
  }
});

app.get('/refresh_token', function(req, res) {

  // requesting access token from refresh token
  var refresh_token = req.query.refresh_token;
  var authOptions = {
    url: 'https://accounts.spotify.com/api/token',
    headers: { 'Authorization': 'Basic ' + (new Buffer(client_id + ':' + client_secret).toString('base64')) },
    form: {
      grant_type: 'refresh_token',
      refresh_token: refresh_token
    },
    json: true
  };

  request.post(authOptions, function(error, response, body) {
    if (!error && response.statusCode === 200) {
      var access_token = body.access_token;
      res.send({
        'access_token': access_token
      });
    }
  });
});


console.log('Listening on 8888');
app.listen(8888);

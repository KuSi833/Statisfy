const SpotifyStrategy = require('passport-spotify').Strategy;

module.exports = (passport) => {
    passport.use(
      new SpotifyStrategy(
        {
          clientID: process.env.SPOTIFY_CLIENT_ID,
          clientSecret: process.env.SPOTIFY_CLIENT_SECRET,
          callbackURL: `http://localhost:${process.env.PORT}/auth/spotify/callback`  // http://localhost:3100/auth/spotify/callback/ 
        },
        async (accessToken, refreshToken, expires_in, profile, done) => {
          User.findOrCreate({ spotifyId: profile.id }, function(err, user) {
            return done(err, user);
          });
        }
      )
    );
}

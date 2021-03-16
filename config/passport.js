const SpotifyStrategy = require('passport-spotify').Strategy;

module.exports = (passport) => {
    passport.use(
      new SpotifyStrategy(
        {
          clientID: process.env.SPOTIFY_CLIENT_ID,
          clientSecret: process.env.SPOTIFY_CLIENT_SECRET,
          callbackURL: '/auth/spotify/callback'
        },
        async (accessToken, refreshToken, expires_in, profile, done) => {
          User.findOrCreate({ spotifyId: profile.id }, function(err, user) {
            return done(err, user);
          });
        }
      )
    );
}

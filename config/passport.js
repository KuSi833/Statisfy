const SpotifyStrategy = require('passport-spotify').Strategy;
const User = require('../models/User');

module.exports = (passport) => {
    passport.use(
      new SpotifyStrategy(
        {
          clientID: process.env.SPOTIFY_CLIENT_ID,
          clientSecret: process.env.SPOTIFY_CLIENT_SECRET,
          callbackURL: `http://localhost:${process.env.PORT}/auth/spotify/callback`  // http://localhost:3100/auth/spotify/callback/ 
        },
        async (accessToken, refreshToken, expires_in, profile, done) => {
            // console.log(profile);
            const newUser = {
                spotifyId: profile.id,
                displayName: profile.displayName,
                image: profile.photos[0].value,
            }

            try {
                var user = await User.findOne({
                    spotifyId: profile.id
                });
                if (user) {
                    done(null, user);
                } else {
                    user = await User.create(newUser);
                    done(null, user);
                }
            } catch (error) {
                console.error(err);
            }


            // User.findOrCreate({ spotifyId: profile.id }, function(err, user) {
            //     return done(err, user);
            // });
        }
      )
    );
    passport.serializeUser((user, done) => done(null, user.id));

    passport.deserializeUser((id, done) => User.findById(id, (err, user) => done(err, user)))
}

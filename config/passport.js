const SpotifyStrategy = require('passport-spotify').Strategy;
const User = require('../models/User');

module.exports = (passport) => {
    passport.use(
        new SpotifyStrategy(
            {
                clientID: process.env.SPOTIFY_CLIENT_ID,
                clientSecret: process.env.SPOTIFY_CLIENT_SECRET,
                callbackURL: `http://localhost:${process.env.PORT}/auth/spotify/callback`, // http://localhost:3100/auth/spotify/callback/
            },
            async (accessToken, refreshToken, expires_in, profile, done) => {
                console.log(profile);
                date_in_ms = Date.now();
                // Creating User object
                const newUser = {
                    spotifyId: profile.id,
                    displayName: profile.displayName,
                    accessToken: accessToken,
                    refreshToken: refreshToken,
                    image: profile.photos[0] === undefined ? undefined : profile.photos[0].value,
                    createdAt: date_in_ms
                };

                // If user doesn't exist in database create one
                try {
                    var user = await User.findOne({
                        spotifyId: profile.id,
                    });
                    if (user) {
                        done(null, user);
                    } else {
                        user = await User.create(newUser);
                        done(null, user);
                    }
                } catch (error) {
                    console.error(error);
                }
            }
        )
    );
    passport.serializeUser((user, done) => done(null, user.id));

    passport.deserializeUser((id, done) =>
        User.findById(id, (err, user) => done(err, user))
    );
};

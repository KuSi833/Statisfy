const redis = require('redis');
const client = redis.createClient(process.env.REDIS_PORT);

const cache = (req, res, next) => {
    const spotifyId = req.user.spotifyId;

    client.hget('spotify_data', spotifyId, (err, data) => {
        if (err) throw err;

        if (data !== null) {
            console.log('Getting data from Cache');
            req.spotifyInfo = JSON.parse(data);
            next();
        } else {
            req.spotifyInfo = null;
            next();
        }
    });
};

module.exports = cache;

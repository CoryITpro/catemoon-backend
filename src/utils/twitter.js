const twit = require("twit");
const configs = require("../configs");
const logger = require("./logger");

const Twitter = new twit({
  consumer_key: configs.twitterConsumerKey,
  consumer_secret: configs.twitterConsumerSecret,
  access_token: configs.twitterAccessToken,
  access_token_secret: configs.twitterAccessTokenSecret,
  timeout_ms: 30 * 1000, // optional HTTP request timeout to apply to all requests.
  strictSSL: true, // optional - requires SSL certificates to be valid.
});

const stream = Twitter.stream("statuses/filter", { track: "#catemoon" });

// Event Handler
stream.on("retweet", (retweet) => {
  logger.log(retweet);
});

module.exports = {
  Twitter,
};

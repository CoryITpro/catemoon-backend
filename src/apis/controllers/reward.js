const config = require("../../configs");
const User = require("../../models/user");
const { Twitter } = require("../../utils/twitter");
const logger = require("../../utils/logger");

const RESPONSE_STATE = require("../../constants/responseState");

const getUserInfo = (screen_names, id_list) =>
  Twitter.get("users/lookup", { user_id: id_list })
    .then(({ data }) => {
      screen_names.push(data);
    })
    .catch((err) => {
      if (err) {
        logger.error(err.message);

        res.status(RESPONSE_STATE.INTERNAL_ERROR).json({
          message:
            "There was an error getting user account screen name from twitter",
        });
        next();
      }
    });

const linkTwitter = (req, res, next) => {
  // Try to find if there is valid user with req.body.walletId
  User.findOne({ walletId: req.body.walletId })
    .select("_id walletId twitter verified")
    .exec()
    .then((user) => {
      // If there isn't an user with given wallet address
      if (!user) {
        // Make default user record
        const user = new User({
          walletId: req.body.walletId,
          twitter: req.body.twitter,
        });

        Twitter.get("followers/ids", { screen_name: req.body.twitter })
          .then(({ data }) => {
            const followers = data.ids;

            logger.log(
              `Holder counts of @${req.body.twitter}: ${followers.length}`
            );

            const requestNumber = Math.floor(followers.length / 100);
            const remains = followers.length % 100;

            let screen_names = [];
            let get_name_requests = [];

            for (let i = 0; i < requestNumber; i++) {
              get_name_requests.push(
                getUserInfo(
                  screen_names,
                  followers.slice(i * 100, i * 100 + 100).join(",")
                )
              );
            }

            if (remains !== 0) {
              get_name_requests.push(
                getUserInfo(
                  screen_names,
                  followers
                    .slice(requestNumber * 100, requestNumber * 100 + 100)
                    .join(",")
                )
              );
            }

            Promise.all(get_name_requests)
              .then(() => {
                screen_names.map((data, index) => {
                  data.map((data, index) => {
                    logger.log("follower", data.screen_name);

                    if (data.screen_name === "verifed") {
                      user.verified = true;

                      user.save().then((newUser) => {
                        res.status(RESPONSE_STATE.OKAY).json({
                          message: `Your address has been successfuly verified with ${newUser.twitter}`,
                        });
                        next();
                      });
                    }
                  });
                });
              })
              .catch((err) => {
                res.status(RESPONSE_STATE.INTERNAL_ERROR).json({
                  message: err.message,
                });
              });

            next();
          })
          .catch((err) => {
            logger.error(err);

            res.status(RESPONSE_STATE.INTERNAL_ERROR).json({
              message:
                "There was an error getting user account status from twitter",
            });
            next();
          });
      } else {
        // Check if there is twitter handler
        res.status(RESPONSE_STATE.OKAY).json({
          message: `This address has already been connected to account @${user.twitter}.`,
        });
        next();
      }
    });
};

module.exports = {
  linkTwitter,
};

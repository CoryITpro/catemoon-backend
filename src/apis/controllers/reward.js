const config = require("../../configs");
const User = require("../../models/user");
const { Twitter } = require("../../utils/twitter");
const logger = require("../../utils/logger");

const RESPONSE_STATE = require("../../constants/responseState");

const linkTwitter = (req, res, next) => {
  // Try to find if there is valid user with req.body.walletId
  User.findOne({ walletId: req.body.walletId })
    .select("_id walletId twitter")
    .exec()
    .then((user) => {
      // If there isn't an user with given wallet address
      if (!user) {
        // Make default user record
        const user = new User({
          walletId: req.body.walletId,
          twitter: req.body.twitter,
        });

        Twitter.get("/users/lookup", { screen_name: req.body.twitter })
          .then(({ data }) => {
            const account_info = data[0];

            if (account_info.verified === true) {
              user
                .save()
                .then((newUser) => {
                  res.status(RESPONSE_STATE.OKAY).json({
                    message: `Your address has been successfully connected to verified twitter account ${newUser.twitter}`,
                  });
                })
                .catch((err) => {
                  res.status(RESPONSE_STATE.INTERNAL_ERROR).json({
                    message: err.message,
                  });
                });
            } else {
              res.status(RESPONSE_STATE.FORBIDDEN).json({
                message: `Your account ${req.body.twitter} is not verified account`,
              });
            }
          })
          .catch((err) => {
            res.status(RESPONSE_STATE.INTERNAL_ERROR).json({
              message: `There was an error while getting twitter account status ${err.stack}`,
            });
            next();
          });

        user
          .save()
          .then((newUser) => {
            res.status(RESPONSE_STATE.OKAY).json({
              message: `Your address has been successfully connected to verified twitter account ${newUser.twitter}`,
            });
          })
          .catch((err) => {
            res.status(RESPONSE_STATE.INTERNAL_ERROR).json({
              message: err.message,
            });
          });
      }
      // If there is such user with given address and twitter screen name
      else {
        // Send response to the client
        res.status(RESPONSE_STATE.OKAY).json({
          message: `This address has already been connected to account @${user.twitter}.`,
        });
      }
    });
};

module.exports = {
  linkTwitter,
};

const config = require("../../configs");
const User = require("../../models/user");
const { Twitter } = require("../../utils/twitter");
const logger = require("../../utils/logger");

const RESPONSE_STATE = require("../../constants/responseState");

const linkTwitter = (req, res, next) => {
  // Try to find if there is valid user with req.body.walletId
  User.findOne({ walletId: req.body.walletId })
    .select("_id walletId twitter verified")
    .exec()
    .then(async (user) => {
      // If there isn't an user with given wallet address
      if (!user) {
        const user = new User({
          walletId: req.body.walletId,
          twitter: req.body.twitter,
        });

        await Twitter.get("followers/ids", { screen_name: "catemoon" })
          .then((data) => {
            const followers = data.ids;

            await Twitter.get("users/lookup", { user_id: followers })
              .then((data) => {
                const screen_names = data;

                screen_names.map((data) => {
                  logger.log(data);
                });

                res.json({
                  message: screen_names,
                });
              })
              .catch((err) => {
                if (err) {
                  logger.error(err);

                  res.status(RESPONSE_STATE.INTERNAL_ERROR).json({
                    message:
                      "There was an error getting user account status from twitter",
                  });
                  next();
                }
              });
          })
          .catch((err) => {
            logger.error(err);

            res.status(RESPONSE_STATE.INTERNAL_ERROR).json({
              message:
                "There was an error getting user account status from twitter",
            });
            next();
          });

        user.save().then((newUser) => {
          res.status(RESPONSE_STATE.OKAY).json({
            message: `Your address has been successfuly verified with ${newUser.twitter}`,
          });
          next();
        });
      }

      // Check if there is twitter handler
      res.status(RESPONSE_STATE.OKAY).json({
        message: `This address has already been connected to account @${user.twitter}.`,
      });
      next();
    });
};

module.exports = {
  linkTwitter,
};

const mongoose = require("mongoose");
const configs = require("../configs");
const logger = require("../utils/logger");

module.exports = (callback) => {
  mongoose.Promise = global.Promise;
  mongoose.connect(
    configs.mongoURL,
    {
      useUnifiedTopology: true,
      useNewUrlParser: true,
      useCreateIndex: true,
    },
    (err) => {
      if (err) {
        logger.error(
          err.message ||
            "# Please install MongoDB and make sure it is running #"
        );

        throw err;
      }

      logger.log("DB: Mongo DB has been connected :DB");

      if (typeof callback === "function") {
        callback();
      }
    }
  );
};

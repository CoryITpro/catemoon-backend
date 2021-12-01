// Server util modules
const cors = require("cors");
const express = require("express");

// Custom logger
const logger = require("./utils/logger");
// Setting up configs
const configs = require("./configs");
// Middlewares
const JwtMiddleware = require("./middlewares/jwtMiddleware");
const ExpressMiddleware = require("./middlewares/expressMiddleware");
const DBMiddleware = require("./middlewares/dbMiddleware");
const ApiMiddleware = require("./middlewares/apiMiddleware");

// Express Application
const app = express();

// Development dependancies
const morgan = configs.mode === "development" ? require("morgan") : null;

// Middlewares
app.use(cors());
app.use((err, req, res, next) => {
  res.status(err.status || 500).send(err);
});

if (configs.mode === "development") {
  app.use(morgan("combined"));
}

// Process middlewares
DBMiddleware();
JwtMiddleware(app);
ExpressMiddleware(app);
ApiMiddleware(app);

// Host Express server
const customHost = configs.host || "localhost";
const customPort = configs.port || 3000;

app.listen(customPort, (err) => {
  if (err) {
    return logger.error(err.message);
  }

  logger.appStarted(customPort, customHost);
});

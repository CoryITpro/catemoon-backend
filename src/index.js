// Setting up configs
require("dotenv").config();

// Server util modules
const cors = require("cors");
const express = require("express");

// Custom logger
const logger = require("./utils/logger");

// Express Application
const app = express();

// Development dependancies
const morgan = process.env.MODE === "development" ? require("morgan") : null;

// Middlewares
app.use(cors());
app.use((err, req, res, next) => {
  res.status(err.status || 500).send(err);
});

if (process.env.MODE === "development") {
  app.use(morgan("combined"));
}

const customHost = process.env.HOST || "localhost";
const customPort = process.env.PORT || 3000;

app.listen(customPort, (err) => {
  if (err) {
    return logger.error(err.message);
  }

  logger.appStarted(customPort, customHost);
});

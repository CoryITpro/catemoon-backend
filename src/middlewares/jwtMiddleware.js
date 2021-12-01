const { config } = require("dotenv");
const expressJWT = require("express-jwt");
const configs = require("../configs");

const jwtMiddleware = expressJWT({
  secret: config.jwtSecret,
  algorithms: ["HS256"],
  requestProperty: "jwt",
});

module.exports = (app) => {
  app.use(configs.apiRoot, jwtMiddleware);
};

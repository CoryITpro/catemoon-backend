const expressJWT = require("express-jwt");
const configs = require("../configs");

const jwtMiddleware = expressJWT({
  secret: configs.jwtSecret,
  algorithms: ["HS256"],
  requestProperty: "jwt",
});

module.exports = (app) => {
  app.use(configs.apiRoot, jwtMiddleware);
};

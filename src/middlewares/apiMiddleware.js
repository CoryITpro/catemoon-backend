const configs = require("../configs");
const apiRoutes = require("../apis");

module.exports = (app) => {
  app.use(configs.apiRoot, apiRoutes);
};

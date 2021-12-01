const dotenv = require("dotenv");
const logger = require("../utils/logger");

try {
  dotenv.config();
} catch {
  logger.error("Can't find dotenv file... Skipping...");
}

module.exports = {
  // Hosting Environments
  mode: process.env.MODE || "production",
  host: process.env.HOST || "127.0.0.1",
  port: process.env.PORT || "3000",
  // Development Environments
  mongoURL: process.env.MONGL_URL || "",
  jwtSecret: process.env.JWT_SECRET || "$ecret",
  jwtExpires: process.env.JWT_EXPIRES || "30d",
  apiRoot: process.env.API_ROOT || "/",
};

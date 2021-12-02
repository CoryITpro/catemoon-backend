const express = require("express");
const ApiRoutes = require("../constants/apiRoutes");

const router = express.Router();

const rewardRoute = require("./routes/reward");

router.use(ApiRoutes.Reward, rewardRoute);

module.exports = router;

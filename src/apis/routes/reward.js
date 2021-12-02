const express = require("express");

const router = express.Router();

const rewardCtrl = require("../controllers/reward");

router.route("/link").get(rewardCtrl.linkTwitter);

module.exports = router;

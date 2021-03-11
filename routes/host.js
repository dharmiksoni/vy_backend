var express = require("express");
var router = express.Router();
const { protect, authorize } = require("../middleware/auth");

const {
	createOppotunity,
} = require("../api/controllers/host/createoppotunity/service");
const { route } = require("./apis");

router
	.route("/createopportunity")
	.post(protect, authorize("Host"), createOppotunity);

module.exports = router;

var express = require("express");
var router = express.Router();
const { protect } = require("../middleware/auth");

const {
	registerUser,
	loginUser,
	getallUsers,
	userProfile,
	logoutUser,
	forgotPassword,
} = require("../api/controllers/auth/service");
const { route } = require("./apis");
router.post("/register", registerUser);
router.post("/login", loginUser);
router.post("/forgotpassword", forgotPassword);
router.route("/logout").post(protect, logoutUser);
router.route("/profile").get(protect, userProfile);
router.get("/getUsers", getallUsers);

module.exports = router;

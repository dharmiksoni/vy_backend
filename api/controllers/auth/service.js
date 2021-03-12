const ErrorResponse = require("../../../utils/errorResponse");
const asyncHandler = require("../../../middleware/async");
const {
	register,
	login,
	getallUsers,
	userProfile,
	logout,
	forgotPassword,
} = require("./controller");
const { MESSAGES } = require("../../../config/constantMessages");

exports.registerUser = asyncHandler(async (req, res, next) => {
	// console.log("req body :", req.body);
	// console.log('nnext : ', next);
	// console.log('req in reg service : ', req);
	const user = await register(req.body);
	// console.log("user  response : ", user);
	if (user.err) return next(user.err);
	res
		.status(200)
		.cookie("accessToken", user.accessToken, user.cookieOptions)
		.json({
			success: true,
			data: {
				token: user.accessToken,
				message: MESSAGES.success.registrationSuccess,
			},
		});
});

// @desc    Login a user
// @route   POST /vy/api/v1/auth/login
// @access  Public
exports.loginUser = asyncHandler(async (req, res, next) => {
	// console.log("request in controller : ", req);
	const { email, password } = req.body;

	if (!email || !password)
		return res.status(400).json({
			success: false,
			message: "Please provide all credentials",
		});
	// return next(new ErrorResponse(`Please provide all credentials`, 400));

	const result = await login(email, password);
	// console.log("result :", result);

	if (result.message)
		return res.status(result.statusCode).json({
			success: false,
			message: result.message,
		});
	// return next(new ErrorResponse(result.message, result.statusCode));

	res
		.status(200)
		// .cookie("accessToken", result.accessToken, result.cookieOptions)
		.json({
			success: true,
			data: {
				accessToken: result.accessToken,
				userId: result.userId,
				userRole: result.role,
			},
		});
});

exports.logoutUser = asyncHandler(async (req, res, next) => {
	// console.log("req service : ", req);
	// req.cookies.set("accessToken", { expires: Date.now() });
	// console.log("res service : ", res);

	const exit = await logout();
	// console.log("exit : ", exit);
});

// @desc    Get user details
// @route   GET /vy/api/v1/auth/me
// @access  Private
exports.userProfile = asyncHandler(async (req, res, next) => {
	const user = await userProfile(req.user.userId);
	res.status(200).json({ success: true, data: user });
});

exports.getallUsers = asyncHandler(async (req, res, next) => {
	const users = await getallUsers();
	// console.log('users: ', users);
	res.status(200).json({ success: true, data: users });
});

exports.forgotPassword = asyncHandler(async (req, res, next) => {
	const { email, password } = req.body;

	if (!email || !password)
		return res.status(400).json({
			success: false,
			message: "Email cannot be empty",
		});

	// return next(new ErrorResponse(`Email cannot be empty`, 400));

	const result = await forgotPassword(email, password);
	// console.log("result :", result);

	if (result.err)
		return res.status(result.statusCode).json({
			success: false,
			message: result.message,
		});
	// return next(new ErrorResponse(result.message, result.statusCode));

	res.status(200).json({
		success: true,
		data: {
			message: result.message,
			// accessToken: result.accessToken,
		},
	});
});

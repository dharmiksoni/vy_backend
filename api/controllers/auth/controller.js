const User = require("../../../models/User");
const Verification = require("../../../models/Verification");
const Token = require("../../../models/Token");
const crypto = require("crypto");
// var helper = require("../../../config/helpers");
const jwt = require("jsonwebtoken");
var helper = require("../../../config/helpers");

// const successHandler = require("../../../utils/successHandler");
// const router = require("./router");

// const { register, login, getMe } = require("../services/authService");

exports.register = async (body) => {
	// console.log('request in reg controller : ', req);
	/**
	 * when registered entries added in user, verification and token models
	 * user - user details
	 * verification - isVerified
	 * token - token, expireAt
	 * delete all matching entries when user gets deleted
	 */
	const {
		mobileNo,
		email,
		firstName,
		lastName,
		password,
		role,
		username,
	} = body;
	// console.log("body : ", body);
	let result = {};
	try {
		const user = await User.create({
			mobileNo,
			email,
			firstName,
			lastName,
			password,
			role,
			username,
		});
		// jwt token
		result = helper.generateToken(user, 200);

		/**
		 * if error while registraion -> not to add entries in any table -> user,
		 * verification, token -> destroy it
		 */

		await Verification.create({
			userId: user.userId,
		}).catch(async (err) => {
			// console.log("error catch : ", err);
			await Verification.destroy({ where: { userId: user.userId } });
			await User.destroy({ where: { userId: user.userId } });
			result.err = err;
		});
		// console.log("user : ", user);
		// token model used to store token, 24 hours default retention
		// crypto token for email link
		var token = await Token.create({
			userId: user.userId,
			token: crypto.randomBytes(16).toString("hex"),
		}).catch(async (err) => {
			console.log("error catch : ", err);
			await User.destroy({ where: { userId: user.userId } });
			await Token.destroy({ where: { userId: user.userId } });
			result.err = err;
		});
		// console.log("token : ", token);
		// send mail with verification link
		// await helper.sendmail(email, "", "", token.token);
		return result;
	} catch (err) {
		result.err = err;
		return result;
	}
};

exports.login = async (email, password) => {
	let result = {};
	const user = await User.scope("withPwd").findOne({ where: { email } });
	console.log("user : ", user);
	if (!user) {
		result.message = `Invalid Credentials`;
		result.statusCode = 401;
		return result;
	}

	// Check for password match
	const isMatch = await user.comparePassword(password);
	if (!isMatch) {
		result.message = `Invalid Credentials`;
		result.statusCode = 401;
		return result;
	}

	result = helper.generateToken(user, 200);
	console.log("result : ", result);
	return result;
};

// logout
exports.logout = async (req, res, next) => {
	// console.log('logout success');
	// console.log("req controller : ", req);
	// console.log("res controller : ", res);
	// return req.cookie
	let result = {};
	// console.log('res :', req);
	cookie = req.cookies;
	// console.log("cookie : ", cookie);
	// for (var prop in cookie) {
	// 	if (!cookie.hasOwnProperty(prop)) {
	// 		continue;
	// 	}
	// 	res.cookie(prop, "", { expires: new Date(0) });
	// }
	// res.redirect("/");
	// const user =
	// console.log("req user :", req);
	// res.clearCookie("accessToken").then((message) => {
	// 	result.message = `Logout success`;
	// 	result.statusCode = 200;
	// 	return result;
	// });
	// console.log("logout successfully");
	// await req.user.save();
	// res.cookie.set(
	// 	"accessToken",
	// 	{ expires: Date.now() }.then((message) => {
	// 		result.message = `Logout success`;
	// 		result.statusCode = 200;
	// 		return result;
	// 	})
	// );
	// return res.sendStatus(200);

	// let sess = req
};

// profile or logged in user details
exports.userProfile = async (userId) => {
	const user = await User.findOne({
		where: { userId },
		include: [
			{
				model: Verification,
			},
		],
	});
	return user;
};

// get all users list
exports.getallUsers = async (req, res) => {
	let result = {};

	const users = await User.findAll()
		// .then((data) => {
		// 	res.send(data);
		// })
		.catch((err) => {
			result.err = err;
			return result;
			// res.status(500).send({
			// 	message:
			// 		err.message || "Some error occurred while retrieving tutorials.",
			// });
		});
	// console.log("length : ", users.length);
	return users;
};

exports.forgotPassword = async (email, password) => {
	let result = {};
	await User.findOne({ where: { email } }).then((record) => {
		if (!record) {
			result.message = `Email doesn't match`;
			result.statusCode = 401;
			return result;
			// throw new Error("no record");
		}
		return record.update({ password }).then((updateRecord) => {
			// console.log("updated rows : ", updateRecord);
			result.message = `password changed`;
			result.statusCode = 200;
			return result;
		});
	});
	return result;
};

const ErrorResponse = require("../../../../utils/errorResponse");
const asyncHandler = require("../../../../middleware/async");
const { createOppotunity } = require("./controller");
const { MESSAGES } = require("../../../../config/constantMessages");

exports.createOppotunity = asyncHandler(async (req, res, next) => {
	// console.log("req body :", req.body);
	const {
		placeName,
		positionDescription,
		category,
		duration,
		perks,
	} = req.body;
	if (!placeName || !positionDescription || !category || !duration || !perks)
	return res.status(400)
		.json({
			success: false,
			message: 'Please provide all the details'
		});
		// return next(new ErrorResponse(`Please provide all credentials`, 400));

	// console.log('nnext : ', next);
	const opportunity = await createOppotunity(
		placeName,
		positionDescription,
		category,
		duration,
		perks
	);
	// console.log("opportunity  response : ", opportunity);
	if (opportunity.err) return next(opportunity.err);
	res
		.status(200)
		// .cookie("accessToken", user.accessToken, user.cookieOptions)
		.json({
			success: true,
			data: {
				// status: opportunity.statusCode,
				message: opportunity.message,
			},
		});
});

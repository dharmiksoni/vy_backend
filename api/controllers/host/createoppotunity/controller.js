const Places = require("../../../../models/Places");
const Host = require("../../../../models/Host");

exports.createOppotunity = async (
	placeName,
	positionDescription,
	category,
	duration,
	perks
) => {
	let response = {};

	try {
		const opportunity = await Places.create({
			placeName,
			positionDescription,
			category,
			duration,
			perks,
		}).catch((err) => {
			response.err = err;
			return response;
		});
		// console.log("opportunity : ", opportunity);
		// if (!opportunity) {
		// 	result.message = `Something went wrong`;
		// 	result.statusCode = 401;
		// 	return result;
		// }
		if (opportunity) {
			response.message = `Opportunity created`;
			response.statusCode = 200;
			return response;
		}
		// response = opportunity;
		// console.log("response for opportunity : ", opportunity);
		return response;
	} catch (err) {
		response.err = err;
		return response;
	}
};

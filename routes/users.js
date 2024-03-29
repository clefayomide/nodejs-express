import axios from "axios";
import { Router } from "express";
const router = Router();
import { v4 } from "uuid";

let users = [];

const getExternalData = async (req, res, next) => {
	try {
		const responseData = await axios.get(
			"https://jsonplaceholder.typicode.com/users"
		);
		req.externalData = responseData.data;
		next();
	} catch (error) {
		const status = error.response.status;
		const message = error.response.statusText;
		res.status(status).json({
			message: message,
			status: status,
		});
	}
};

/* GET users listing. */
router.get("/", getExternalData, function (req, res) {
	users = req.externalData;
	res.status(200).json({ message: "Success", statusCode: 200, data: users });
});

// find user (allowed search param id and jobTitle)
router.get("/find", function (req, res) {
	const username = req.query.username ?? "";
	// const jobTitle = req.query.jobTitle ?? "";

	let responseData = [];

	if (!username) {
		return res
			.status(422)
			.json({ message: "One or more missing paramter", statusCode: 422 });
	}

	const searchResult = users.filter((user) => {
		const matchUsername =
			!username || user.username.toLowerCase() === username.toLowerCase();
		return matchUsername;
	});

	responseData = searchResult;

	if (responseData.length < 1) {
		return res.status(404).json({ message: "Not found", statusCode: 404 });
	}
	res
		.status(200)
		.json({ message: "Success", statusCode: 200, data: responseData });
});

// add new user
router.post("/", function (req, res) {
	const reqData = req.body;
	if (!reqData.jobTitle) {
		res.status(400).json({ message: "jobTitle is required", statusCode: 400 });
	} else if (!reqData.hasOwnProperty("retired")) {
		res
			.status(400)
			.json({ message: "retired status is required", statusCode: 400 });
	} else {
		const userUuid = v4();
		const data = {
			userId: userUuid,
			id: userUuid,
			...reqData,
			retired: reqData.hasOwnProperty("retired") ? reqData.retired : false,
		};
		users.push(data);
		res.status(200).json({
			message: "User successfully added",
			data: data,
			statusCode: 200,
		});
	}
});

// delete user
router.delete("/", function (req, res) {
	const id = req.query.id ?? "";

	if (!id) {
		res
			.status(422)
			.json({ message: "One or more missing paramter", statusCode: 422 });
	} else {
		const userExist = users.some(({ userId }) => userId === id);

		if (!userExist) {
			return res
				.status(404)
				.json({ message: "user not found", statusCode: 404 });
		}
		users = users.filter(({ userId }) => userId !== id);
		res.status(200).json({
			message: "User deleted successfully",
			statusCode: "200",
			data: users,
		});
	}
});

export default router;

const express = require("express");
const router = express.Router();

const users = [
	{
		userId: 1,
		id: 1,
		jobTitle: "Backend Engineer",
		retired: false,
	},
	{
		userId: 2,
		id: 2,
		jobTitle: "Devops Engineer",
		retired: true,
	},
	{
		userId: 3,
		id: 3,
		jobTitle: "Frontend Engineer",
		retired: false,
	},
	{
		userId: 4,
		id: 4,
		jobTitle: "Cloud Engineer",
		retired: false,
	},
	{
		userId: 5,
		id: 5,
		jobTitle: "Cloud Engineer",
		retired: true,
	},
];

/* GET users listing. */
router.get("/", function (req, res) {
	res.status(200).json({ message: "Success", statusCode: 200, data: users });
});

// find user (allowed search param id and jobTitle)
router.get("/find", function (req, res) {
	const id = req.query.id ?? "";
	const jobTitle = req.query.jobTitle ?? "";

	let responseData = [];

	if (!id && !jobTitle) {
		return res
			.status(422)
			.json({ message: "One or more missing paramter", statusCode: 422 });
	}

	const searchResult = users.filter((user) => {
		const matchId = !id || parseInt(user.id) === parseInt(id);
		const matchJobTitle =
			!jobTitle || user.jobTitle.toLowerCase() === jobTitle.toLowerCase();
		return matchId && matchJobTitle;
	});

	responseData = searchResult;

	if (responseData.length < 1) {
		return res.status(404).json({ message: "Not found", statusCode: 404 });
	}
	res
		.status(200)
		.json({ message: "Success", statusCode: 200, data: responseData });
});

module.exports = router;

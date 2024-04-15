const { fetchTopics } = require('../models/topics.models');
const endpoints = require('../endpoints.json');


function getTopics(req, res, next) {
	fetchTopics().then((topics) => {
		res.status(200).send({ topics });
	});
}

module.exports = { getTopics};

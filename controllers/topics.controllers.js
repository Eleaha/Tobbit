const { fetchTopics, insertTopic } = require('../models/topics.models');

function getTopics(req, res, next) {
	fetchTopics().then((topics) => {
		res.status(200).send({ topics });
	});
}

function postTopic(req, res, next) {
	const postBody = req.body;

	insertTopic(postBody).then((newTopic) => {
		res.status(201).send({ newTopic });
	})
	.catch(next)
}

module.exports = { getTopics, postTopic };

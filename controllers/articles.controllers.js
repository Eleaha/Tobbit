const {
	fetchArticleById,
	fetchArticles,
	updateVotesById,
} = require('../models/articles.models');
const { checkTopicExists } = require('../models/topics.models');

function getArticleById(req, res, next) {
	const { article_id } = req.params;
	fetchArticleById(article_id)
		.then((article) => {
			res.status(200).send({ article });
		})
		.catch(next);
}

function getArticles(req, res, next) {
	const validQueries = ['topic', 'sort_by', 'order'];

	const isValidQuery = Object.keys(req.query).every((query) =>
		validQueries.includes(query)
	);
	if (!isValidQuery) {
		res.status(400).send({ msg: 'Invalid query' });
	}

	const { topic, sort_by, order } = req.query;

	Promise.all([fetchArticles(topic, sort_by, order), checkTopicExists(topic)])
		.then(([articles]) => {
			res.status(200).send({ articles });
		})
		.catch(next);
}

function patchArticleById(req, res, next) {
	const id = req.params.article_id;
	const votes = req.body.inc_votes;

	updateVotesById(id, votes)
		.then((article) => {
			res.status(200).send({ article });
		})
		.catch(next);
}

module.exports = { getArticleById, getArticles, patchArticleById };

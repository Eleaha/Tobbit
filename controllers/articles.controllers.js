const {
	fetchArticleById,
	fetchArticles,
	updateVotesById
} = require('../models/articles.models');
const {checkTopicExists} = require('../models/topics.models')

function getArticleById(req, res, next) {
	const { article_id } = req.params;
	return fetchArticleById(article_id)
		.then((article) => {
			res.status(200).send({ article });
		})
		.catch(next);
}

function getArticles(req, res, next) {
	const {topic} = req.query

	return Promise.all([fetchArticles(topic), checkTopicExists(topic)])
	.then(([articles]) => {
		res.status(200).send({ articles });
	})
	.catch(next)
}

function patchArticleById(req, res, next){
	const id = req.params.article_id
	const votes = req.body.inc_votes

	return updateVotesById(id, votes).then((article) => {
		res.status(200).send({article})
	})
	.catch(next)
}

module.exports = { getArticleById, getArticles, patchArticleById };
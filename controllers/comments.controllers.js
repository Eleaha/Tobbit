const {
	fetchCommentsByArticleId,
	insertCommentByArticleId,
} = require('../models/comments.models');
const { checkArticleExists } = require('../models/articles.models');

function getCommentsByArticleId(req, res, next) {
	const id = req.params.article_id;

	Promise.all([fetchCommentsByArticleId(id), checkArticleExists(id)])
		.then(([comments]) => {
			res.status(200).send({ comments });
		})
		.catch(next);
}

function postCommentByArticleId(req, res, next) {
	const id = req.params.article_id;
	const commentToPost = req.body;
	commentToPost.article_id = +id;
	return checkArticleExists(id)
		.then(() => {
			return insertCommentByArticleId(commentToPost);
		})
		.then((comment) => {
			res.status(201).send({ comment });
		})
		.catch(next);
}

module.exports = { getCommentsByArticleId, postCommentByArticleId };

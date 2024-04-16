const { fetchCommentsByArticleId } = require('../models/comments.models');
const { checkArticleExists } = require('../models/articles.models');

function getCommentsByArticleId(req, res, next) {
	const id = req.params.article_id;

	Promise.all([fetchCommentsByArticleId(id), checkArticleExists(id)])
		.then(([comments]) => {
			res.status(200).send({ comments });
		})
		.catch(next);
}

module.exports = { getCommentsByArticleId };

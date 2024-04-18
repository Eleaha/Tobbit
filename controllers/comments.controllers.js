const {
	fetchCommentsByArticleId,
	insertCommentByArticleId,
	removeCommentById,
	updateCommentVotesById,
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

	const validKeys = ['username', 'body'];

	if (
		JSON.stringify(validKeys) !== JSON.stringify(Object.keys(commentToPost))
	) {
		res.status(400).send({ msg: 'Bad request' });
	} else {
		commentToPost.article_id = +id;
		checkArticleExists(id)
			.then(() => {
				return insertCommentByArticleId(commentToPost);
			})
			.then((comment) => {
				res.status(201).send({ comment });
			})
			.catch(next);
	}
}

function deleteCommentById(req, res, next){
	const id = req.params.comment_id
	removeCommentById(id).then(()=> {
		res.status(204).send()
	})
	.catch(next)

}

function patchCommentById(req, res, next){
	const id = req.params.comment_id
	const votes = req.body.inc_votes

	updateCommentVotesById(id, votes).then((comment) => {
		res.status(200).send({comment})
	})
	.catch(next)
}

module.exports = {
	getCommentsByArticleId,
	postCommentByArticleId,
	deleteCommentById,
	patchCommentById
};

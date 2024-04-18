const db = require('../db/connection');

function fetchCommentsByArticleId(id) {
	return db
		.query(
			`SELECT * FROM comments WHERE article_id=$1 ORDER BY created_at DESC`,
			[id]
		)
		.then(({ rows }) => {
			return rows;
		});
}

function insertCommentByArticleId(comment) {
	const commentValues = Object.values(comment);
	return db
		.query(
			`INSERT INTO comments (author, body, article_id)
	   VALUES ($1, $2, $3) RETURNING *;`,
			commentValues
		)
		.then(({ rows }) => {
			return rows[0];
		});
}

function removeCommentById(id) {
	return db.query(
		`DELETE FROM comments
		WHERE comment_id=$1 RETURNING *`, [id]
	)
	.then(({rows}) => {
		if(!rows.length){
			return Promise.reject({status: 404, msg: 'Comment id not found'})
		}
	})
}

function updateCommentVotesById(id, votes){
	return db.query(
		`UPDATE comments
		SET votes = votes + $1
		WHERE comment_id=$2
		RETURNING *`, [votes, id]
	).then(({rows}) => {
		if(!rows.length){
			return Promise.reject({status: 404, msg: 'Not found'})
		}
		return rows[0]
	})
}
module.exports = {
	fetchCommentsByArticleId,
	insertCommentByArticleId,
	removeCommentById,
	updateCommentVotesById,
};

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

module.exports = { fetchCommentsByArticleId, insertCommentByArticleId };

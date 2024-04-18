const db = require('../db/connection');

function fetchArticleById(id) {
	return db
		.query(
			`SELECT articles.author, articles.title, articles.article_id, articles.topic, articles.created_at, articles.article_img_url, articles.body, COUNT(comments.article_id)::INT AS comment_count 
			FROM articles
			LEFT JOIN comments
			ON comments.article_id = articles.article_id
			WHERE articles.article_id=$1
			GROUP BY articles.author, articles.title, articles.article_id, articles.topic, articles.created_at, articles.article_img_url, articles.body;`,
			[id]
		)
		.then(({ rows }) => {
			if (!rows.length) {
				return Promise.reject({ status: 404, msg: 'Not found' });
			}
			return rows[0];
		});
}

function fetchArticles(topic, sortBy = 'created_at', order = 'desc') {
	const validSortBy = [
		'article_id',
		'title',
		'topic',
		'author',
		'body',
		'created_at',
		'article_img_url',
	];
	const validOrders = ['asc', 'desc'];

	if (!validSortBy.includes(sortBy)) {
		return Promise.reject({ status: 400, msg: 'Invalid query' });
	}

	if (!validOrders.includes(order)) {
		return Promise.reject({ status: 400, msg: 'Invalid query' });
	}

	let dbQuery = `SELECT 
            articles.author, articles.title, articles.article_id, articles.topic, articles.created_at, articles.article_img_url, 
            COALESCE(SUM(comments.votes), 0)::INT
            AS votes, 
            COUNT(comments.article_id)::INT
            AS comment_count 
            FROM articles
            LEFT JOIN comments 
            ON comments.article_id = articles.article_id`;

	const queryValues = [];

	if (topic) {
		dbQuery += ` WHERE topic=$1`;
		queryValues.push(topic);
	}

	dbQuery += ` GROUP BY articles.author, articles.title, articles.article_id, articles.topic, articles.created_at, articles.article_img_url ORDER BY ${sortBy}`;

	if (order === 'desc') {
		dbQuery += ` DESC;`;
	}

	return db.query(dbQuery, queryValues).then(({ rows }) => {
		return rows;
	});
}

function checkArticleExists(id) {
	return db
		.query(`SELECT * FROM articles WHERE article_id=$1`, [id])
		.then(({ rows }) => {
			if (!rows.length) {
				return Promise.reject({
					status: 404,
					msg: 'Not found',
				});
			}
		});
}

function updateVotesById(id, votes) {
	return db
		.query(
			`
	UPDATE articles
	SET votes = votes + $1
	WHERE article_id=$2
	RETURNING *`,
			[votes, id]
		)
		.then(({ rows }) => {
			if (!rows.length) {
				return Promise.reject({ status: 404, msg: 'Article not found' });
			}
			return rows[0];
		});
}

function insertArticle(article){

	const queryValues = Object.values(article)

	return db.query(
		`INSERT INTO articles(author, title, body, topic)
		VALUES($1, $2, $3, $4)
		RETURNING *`,
		queryValues
	).then(({ rows }) => {
		rows[0].comment_count = 0
		return rows[0]
	});
}

module.exports = {
	fetchArticleById,
	fetchArticles,
	checkArticleExists,
	updateVotesById,
	insertArticle
};

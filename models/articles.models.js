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

function fetchArticles(
	topic,
	sortBy = 'created_at',
	order = 'desc',
	limit = 10,
	p = 1
) {
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

	const validP = /[\d]/;

	if (!validSortBy.includes(sortBy)) {
		return Promise.reject({ status: 400, msg: 'Invalid query' });
	}

	if (!validOrders.includes(order)) {
		return Promise.reject({ status: 400, msg: 'Invalid query' });
	}

	if (!validP.test(p)) {
		return Promise.reject({ status: 400, msg: 'Bad request' });
	}

	let dbQuery = `SELECT 
            articles.author, articles.title, articles.article_id, articles.topic, articles.created_at, articles.article_img_url, 
            COALESCE(SUM(comments.votes), 0)::INT
            AS votes, 
            COUNT(comments.article_id)::INT
            AS comment_count ,
			COUNT(*) OVER()::INT
			AS total_count
            FROM articles
            LEFT JOIN comments 
            ON comments.article_id = articles.article_id`;

	const queryValues = [];

	if (topic) {
		dbQuery += ` WHERE topic = $1`;
		queryValues.push(topic);
	}

	dbQuery += ` GROUP BY articles.author, articles.title, articles.article_id, articles.topic, articles.created_at, articles.article_img_url 
			ORDER BY ${sortBy} ${order.toUpperCase()}, article_id
			LIMIT ${limit}`;

	if (p > 1) {
		const offset = (p - 1) * limit;
		dbQuery += ` OFFSET ${offset}`;
	}

	return db.query(dbQuery, queryValues).then(({ rows }) => {
		const offset = (p - 1) * limit;

		if (offset > rows.length) {
			return Promise.reject({ status: 404, msg: 'Not found' });
		}

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

function insertArticle(article) {
	const queryValues = Object.values(article);

	queryStr = `INSERT INTO articles(author, title, body, topic`;

	if (queryValues.length > 4) {
		queryStr += `, article_img_url`;
	}

	queryStr += `) VALUES($1, $2, $3, $4`;

	if (queryValues.length > 4) {
		queryStr += `, $5`;
	}

	queryStr += `) RETURNING *`;

	return db.query(queryStr, queryValues).then(({ rows }) => {
		rows[0].comment_count = 0;
		return rows[0];
	});
}

module.exports = {
	fetchArticleById,
	fetchArticles,
	checkArticleExists,
	updateVotesById,
	insertArticle,
};

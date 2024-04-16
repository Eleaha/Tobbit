const db = require('../db/connection');

function fetchArticleById(id) {
	return db
		.query('SELECT * FROM articles WHERE article_id=$1', [id])
		.then(({ rows }) => {
			if (!rows.length) {
				return Promise.reject({ status: 404, msg: 'Article not found' });
			}
			return rows[0];
		});
}

function fetchArticles() {
	return db
		.query(
			`SELECT 
            articles.author, articles.title, articles.article_id, articles.topic, articles.created_at, articles.article_img_url, 
            CAST(COALESCE(SUM(comments.votes), 0) AS INTEGER) 
            AS votes, 
            CAST(COUNT(comments.article_id) AS INTEGER) 
            AS comment_count 
            FROM articles 
            LEFT JOIN comments 
            ON comments.article_id = articles.article_id 
            GROUP BY articles.author, articles.title, articles.article_id, articles.topic, articles.created_at, articles.article_img_url
            ORDER BY created_at DESC;`
		)
		.then(({ rows }) => {
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
					msg: 'Article not found',
				});
			}
		});
}

module.exports = { fetchArticleById, fetchArticles, checkArticleExists };

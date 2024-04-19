const { promises } = require('supertest/lib/test');
const db = require('../db/connection');

function fetchTopics() {
	return db.query(`SELECT * FROM topics`).then(({ rows }) => {
		return rows;
	});
}

function checkTopicExists(topic) {
	if (topic) {
		return db
			.query(`SELECT * FROM topics WHERE slug=$1`, [topic])
			.then(({ rows }) => {
				if (!rows.length) {
					return Promise.reject({
						status: 404,
						msg: 'Not found',
					});
				}
			});
	}
}

function insertTopic(topic) {
	const topicValues = Object.values(topic);

	const validKeys = ['slug', 'description'];

	if (JSON.stringify(validKeys) !== JSON.stringify(Object.keys(topic))) {
		return Promise.reject({status: 400, msg: 'Bad request' });
	} else {

		return db
			.query(
				`INSERT INTO topics (slug, description)
				VALUES ($1, $2)
				RETURNING *`,
				topicValues
			)
			.then(({ rows }) => {
				console.log(rows, 'model')
				return rows[0];
			});
	}
}

module.exports = { fetchTopics, checkTopicExists, insertTopic };

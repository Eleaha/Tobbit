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

module.exports = { fetchTopics, checkTopicExists };

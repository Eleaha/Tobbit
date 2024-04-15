const express = require('express');
const { getTopics } = require('./controllers/topics.controllers');
const { getEndpoints } = require('./controllers/api.controllers');
const { getArticleById } = require('./controllers/articles.controllers');

const app = express();

app.get('/api', getEndpoints);

app.get('/api/topics', getTopics);

app.get('/api/articles/:article_id', getArticleById);

app.all('*', (req, res, next) => {
	res.status(404).send({ msg: '404 - not found' });
});

app.use((err, req, res, next) => {
	if (err.status && err.msg) {
		res.status(err.status).send({ msg: err.msg });
	}
	next(err);
});

app.use((err, req, res, next) => {
	if (err.code === '22P02') {
		res.status(400).send({ msg: 'Bad request' });
	}
	next(err)
});

app.use((err, req, res, next) => {
	res.status(500).send({ msg: 'Internal Server Error' });
});

module.exports = app;

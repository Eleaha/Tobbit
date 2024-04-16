const express = require('express');
const { getTopics } = require('./controllers/topics.controllers');
const { getEndpoints } = require('./controllers/api.controllers');
const {
	getArticleById,
	getArticles,
} = require('./controllers/articles.controllers');
const {getCommentsByArticleId} = require('./controllers/comments.controllers')

const app = express();

app.get('/api', getEndpoints);

app.get('/api/topics', getTopics);

app.get('/api/articles/:article_id', getArticleById);
app.get('/api/articles', getArticles);

app.get('/api/articles/:article_id/comments', getCommentsByArticleId)

app.all('*', (req, res, next) => {
	res.status(404).send({ msg: 'Not found' });
});

app.use((err, req, res, next) => {
	if (err.status && err.msg) {
		res.status(err.status).send({ msg: err.msg });
	} else {
		next(err);
	}
});

app.use((err, req, res, next) => {
	if (err.code === '22P02') {
		res.status(400).send({ msg: 'Bad request' });
	} else {
		next(err);
	}
});

app.use((err, req, res, next) => {
	res.status(500).send({ msg: 'Internal server error' });
});

module.exports = app;

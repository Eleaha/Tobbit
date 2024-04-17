const express = require('express');
const { getTopics } = require('./controllers/topics.controllers');
const { getEndpoints } = require('./controllers/api.controllers');
const {
	getArticleById,
	getArticles,
	patchArticleById,
} = require('./controllers/articles.controllers');
const {
	getCommentsByArticleId,
	postCommentByArticleId,
	deleteCommentById,
} = require('./controllers/comments.controllers');
const { getUsers } = require('./controllers/users.controllers');

const app = express();
app.use(express.json());

app.get('/api', getEndpoints);

app.get('/api/topics', getTopics);

app.get('/api/articles', getArticles);

app.get('/api/users', getUsers);

app.get('/api/articles/:article_id', getArticleById);
app.patch('/api/articles/:article_id', patchArticleById);

app.get('/api/articles/:article_id/comments', getCommentsByArticleId);
app.post('/api/articles/:article_id/comments', postCommentByArticleId);

app.delete('/api/comments/:comment_id', deleteCommentById);


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
	} else if (err.code === '23502') {
		res.status(400).send({ msg: 'Invalid input format' });
	}
	{
		next(err);
	}
});

app.use((err, req, res, next) => {
	res.status(500).send({ msg: 'Internal server error' });
});

module.exports = app;

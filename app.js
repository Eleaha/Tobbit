const express = require('express');
const { getTopics } = require('./controllers/topics.controllers');
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
const {apiRouter} = require('./routes/api-router')
const { articlesRouter } = require('./routes/articles-router');

const app = express();

app.use(express.json());

app.use('/api', apiRouter);

app.use('/api/articles', articlesRouter)

app.get('/api/topics', getTopics);

app.get('/api/users', getUsers);

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
	else if (err.code === '23503'){
		res.status(400).send({msg: 'Bad request'})
	}
	{
		next(err);
	}
});

app.use((err, req, res, next) => {
	res.status(500).send({ msg: 'Internal server error' });
});

module.exports = app;

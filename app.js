const express = require('express');
const { getTopics } = require('./controllers/topics.controllers');

const {
	apiRouter,
	articlesRouter,
	usersRouter,
	commentsRouter,
	topicsRouter,
} = require('./routes/routes.index');

const app = express();

app.use(express.json());

app.use('/api', apiRouter);
app.use('/api/articles', articlesRouter);
app.use('/api/users', usersRouter);
app.use('/api/comments', commentsRouter);
app.use('/api/topics', topicsRouter);

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
	} else if (err.code === '23503') {
		res.status(400).send({ msg: 'Bad request' });
	} else if (err.code === '08P01') {
		res.status(400).send({ msg: 'Bad request' });
	} else if (err.code === '42703') {
		res.status(400).send({ msg: 'Bad request' });
	}
	{
		next(err);
	}
});

app.use((err, req, res, next) => {
	res.status(500).send({ msg: 'Internal server error' });
});

module.exports = app;

const express = require('express');
const { getTopics} = require('./controllers/topics.controllers');
const { getEndpoints } = require('./controllers/api.controllers');
const endpoints = require('./endpoints.json')

const app = express();

app.get('/api', getEndpoints);

app.get('/api/topics', getTopics);

app.all('*', (req, res, next) => {
	res.status(404).send({ msg: '404 - not found' });
	next();
});

app.use((err, req, res, next) => {
    console.log('not caught')
	res.status(500).send({ msg: 'Internal Server Error' });
});

module.exports = app;

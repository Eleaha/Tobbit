const express = require('express')
const {getTopics} = require('./controllers/topics.controllers')

const app = express()

app.get('/api/topics', getTopics)


app.all('*', (req, res, next) => {
    res.status(404).send({msg: '404 - not found'})
    next()
})

app.use((err, req, res, next) => {
    res.status(500).send({msg: 'Internal Server Error'})
})

module.exports = app
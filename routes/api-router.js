const apiRouter = require('express').Router()
const { getEndpoints } = require('../controllers/api.controllers');

apiRouter.get('/', getEndpoints)

module.exports = {apiRouter}
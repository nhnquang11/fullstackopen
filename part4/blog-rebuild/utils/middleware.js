const logger = require('./logger')
const jwt = require('jsonwebtoken')
require('dotenv').config()

const requestLogger = (request, reponse, next) => {
  logger.info('Method:', request.method)
  logger.info('Path:  ',request.path)
  logger.info('Body:  ',request.body)
  logger.info('---')
  next()
}

const tokenExtractor = (request, response, next) => {
  const authorizationHeader = request.get('Authorization')

  if (authorizationHeader && authorizationHeader.startsWith('Bearer ')) {
    const token = authorizationHeader.replace('Bearer ', '')
    request.token = token
  } else {
    response.status(401).json({ error: 'Token missing or malformed' })
  }
  next()
}

const userExtractor = (request, response, next) => {
  try {
    const decodedToken = jwt.verify(request.token, process.env.SECRET)
    request.user = {
      username: decodedToken.username,
      id: decodedToken.id,
    }
    next()
  } catch (error) {
    next(error)
  }
}

const errorHandler = (error, request, response, next) => {
  logger.error(error.message)
  if (error.name === 'ValidationError') {
    return response.status(409).send({ error: error.message })
  }

  next(error)
}

const unknownEndpoint = (request, response) => {
  response.status(404).send({
    error: 'Unknown endpoint'
  })
}

module.exports = {
  requestLogger,
  unknownEndpoint,
  errorHandler,
  tokenExtractor,
  userExtractor
}
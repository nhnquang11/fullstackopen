const usersRouter = require('express').Router()
const bcrypt = require('bcrypt')
const User = require('../models/user')
require('dotenv').config()

usersRouter.get('/', async (request, response) => {
  const users = await User.find({}).populate('blogs')
  response.status(200).json(users)
})

usersRouter.post('/', async (request, response, next) => {
  try {
    const { username, password, name } = request.body
    const saltRounds = 10
    const passwordHash = await bcrypt.hash(password, saltRounds)
    const user = new User({
      username: username,
      name: name,
      passwordHash
    })

    const savedUser = await user.save()
    console.log(savedUser)
    response.status(201).json(savedUser)
  } catch (error) {
    next(error)
  }
})

module.exports = usersRouter

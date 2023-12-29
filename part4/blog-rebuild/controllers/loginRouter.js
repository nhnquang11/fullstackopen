const loginRouter = require('express').Router()
const jwt = require('jsonwebtoken')
const User = require('../models/user')
const bcrypt = require('bcrypt')
require('dotenv').config()

loginRouter.post('/', async (request, response) => {
  const { password } = request.body
  const body = request.body
  console.log(body.username)
  console.log(body.password)
  console.log(body.name)

  const user = await User.findOne({ username: body.username })
  const passwordCorrect = user === null ? false : await bcrypt.compare(password, user.passwordHash)

  if (!(user && passwordCorrect)) {
    return response.status(401).json({
      error: 'invalid username or password'
    })
  }

  const userForToken = {
    username: user.username,
    id: user._id,
  }

  const token = jwt.sign(userForToken, process.env.SECRET, { expiresIn: 60 * 60 })
  response.status(200).json({ token, username: user.username, name: user.name })
})


module.exports = loginRouter

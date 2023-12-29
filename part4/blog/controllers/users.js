const bcrypt = require('bcrypt')
const usersRouter = require('express').Router()
const User = require('../models/user')

usersRouter.get('/', async (request, response) => {
  const users = await User.find({}).populate('blogs',{ url: 1, title: 1, author: 1, id: 1 })
  response.json(users)
})

usersRouter.post('/', async (request, response, next) => {
  try {
    const { username, name, password } = request.body
    const saltRounds = 10
    const passwordHash = await bcrypt.hash(password, saltRounds)
    console.log(passwordHash)
    const user = new User({
      username,
      name,
      passwordHash,
    })

    const savedUser = await user.save()
    response.status(201).json(savedUser)
  } catch (error) {
    next(error)
  }
})

// usersRouter.patch('/:id', async (request, response, next) => {
//   try {
//     const id = request.params.id
//     const user = await User.findById(id)
//     user.name = 'Mars'
//     const savedUser = await user.save()
//     console.log(savedUser)
//     response.end()
//   } catch (error) {
//     next(error)
//   }
// })

module.exports = usersRouter
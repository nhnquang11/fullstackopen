const Blog = require('../models/blog')
const blogsRouter = require('express').Router()
const User = require('../models/user')

blogsRouter.get('/', async (request, response) => {
  const blogs = await Blog.find().populate({
    path: 'user',
    select: '-blogs',
  })
  response.status(200).json(blogs)
})

blogsRouter.post('/', async (request, response, next) => {
  try {
    const { username } = request.user
    const user = await User.findOne({ username })
    const { title, author, url, likes } = request.body

    const blog = new Blog({ title, author, url, likes, user: user._id })
    const savedBlog = await blog.save()

    user.blogs = user.blogs.concat(savedBlog._id)
    await user.save()

    response.status(201).json(savedBlog)
  } catch (error) {
    next(error)
  }
})

blogsRouter.delete('/:id', async (request, response, next) => {
  try {
    const { username } = request.user
    const user = await User.findOne({ username })
    const blogId = request.params.id
    if (!user.blogs.includes(blogId)) {
      return response.status(401).json({ error: 'Unauthorized deletion' })
    }
    await Blog.findByIdAndDelete(blogId)
    user.blogs = user.blogs.filter(id => id !== blogId)
    await user.save()
    response.status(200).end()
  } catch (error) {
    next(error)
  }
})

module.exports = blogsRouter
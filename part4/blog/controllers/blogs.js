const blogsRouter = require('express').Router()
const Blog = require('../models/blog')

blogsRouter.get('/', async (request, response, next) => {
  try {
    const blogs = await Blog.find({}).populate('user',{ username: 1, name: 1, id: 1 })
    response.json(blogs)
  } catch (error) {
    next(error)
  }

})

blogsRouter.get('/:id', async (request, response, next) => {
  try {
    const blog = await Blog.findById(request.params.id)
    if (blog) {
      response.json(blog)
    } else {
      response.status(404).end()
    }
  } catch (error) {
    next(error)
  }
})

blogsRouter.post('/', async (request, response, next) => {
  try {
    const body = request.body
    const user = request.user

    if(!user){
      return response.status(401).json({ error: 'token missing or invalid' })
    }
    // console.log(decodedToken)
    // console.log(user)
    const blog = new Blog({
      title: body.title,
      author: body.author,
      url: body.url,
      user: user._id
    })

    const savedBlog = await blog.save()
    user.blogs = user.blogs.concat(savedBlog._id)
    await user.save()

    response.json(savedBlog)
  } catch (error) {
    next(error)
  }

})

blogsRouter.delete('/:id', async (request, response, next) => {
  try {
    console.log('token', request.token)
    const user = request.user

    if(!user){
      return response.status(401).json({ error: 'token missing or invalid' })
    }
    const blog = await Blog.findById(request.params.id)
    if ( blog.user.toString() === user._id.toString() ) {
      await Blog.findByIdAndDelete(request.params.id)
      user.blogs = user.blogs.filter(blogId => blogId !== request.params.id)
      await user.save()
      response.status(204).end()
    }
  } catch(error) {
    next(error)
  }

})

blogsRouter.put('/api/notes/:id', (request, response) => {
  const body = request.body

  const note = {
    title: body.title,
    author: body.author,
    url: body.url,
    likes: body.likes
  }

  const updatedBlog = Blog.findByIdAndUpdate(request.params.id, note, { new: true })
  response.json(updatedBlog)
})

module.exports = blogsRouter
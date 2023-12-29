const config = require('../utils/config')
const mongoose = require('mongoose')
const supertest = require('supertest')
const app = require('../app')
const Blog = require('../models/blog')
const helper = require('./test_helper')
const api = supertest(app)
mongoose.connect(config.MONGO_URL)

beforeEach(async () => {
  await Blog.deleteMany({})
  await Blog.insertMany(helper.initialBlogs)
})


test('blogs are returned as json', async () => {
  await api
    .get('/api/blogs')
    .expect(200)
    .expect('Content-Type', /application\/json/)
})

test('verify existence of the blogs', async () => {
  const response = await api.get('/api/blogs')
  for (const blog of response.body) {
    expect(blog.id).toBeDefined()
  }
})

test('test HTTP POST request', async () => {
  let response = await api.get('/api/blogs')
  const initialLength  = response.body.length

  const blog = new Blog({
    'title': 'Dummy title',
    'author': 'Dummy author',
    'url': 'http://www.example.com/dummy',
    'likes': 42,
  })

  await blog.save()
  response = await api.get('/api/blogs')
  expect(response.body.length).toEqual(initialLength + 1)
})

test('test likes property is set to 0 as default when not given', async () => {
  const blog = new Blog({
    'title': 'Dummy title',
    'author': 'Dummy author',
    'url': 'http://www.example.com/dummy',
  })

  const result = await blog.save()
  expect(result.likes).toEqual(0)
})

test('responds 400 Bad Request if the title or url properties are missing', async () => {
  const invalidBlog = new Blog({
    'url': 'http://www.example.com/dummy',
  })

  await expect(invalidBlog.save()).rejects.toThrowError(mongoose.Error.ValidationError)
})


afterAll(async () => {
  await mongoose.connection.close()
})
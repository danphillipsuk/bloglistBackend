const blogsRouter = require('express').Router()
require('express-async-errors')
const Blog = require('../models/blog')
const User = require('../models/user')
const jwt = require('jsonwebtoken')

blogsRouter.get('/', async (request, response) => {
  const blogs = await Blog
    .find({}).populate('user', { username: 1, name: 1 })
    response.json(blogs)
})

blogsRouter.get('/:id', async (request, response) => {
  const blog = await Blog.findById(request.params.id)
  if (blog) {
    response.json(blog)
  } else {
    response.status(404).end()
  }
})

blogsRouter.post('/', async (request, response) => {
  const body = request.body

  if (body.title === undefined || body.url === undefined) {
    response.status(400).end()
  } else {
    const decodedToken = jwt.verify(request.token, process.env.SECRET)
    if (!decodedToken.id) {
      return response.status(401).json({ 
        error: 'token missing or invalid'
      })
    }
    const user = await User.findById(decodedToken.id)

    const blog = new Blog({
      title: body.title,
      author: body.author,
      url: body.url,
      likes: 0,
      date: new Date(),
      user: user._id
    })
    
    const savedBlog = await blog.save()
    user.blogs = user.blogs.concat(savedBlog._id)
    await user.save()

    response.json(savedBlog)
  }
})

blogsRouter.delete('/:id', async (request, response) => {

  const blog = await Blog.findById(request.params.id)
  const decodedToken = jwt.verify(request.token, process.env.SECRET)

  if (decodedToken.id === blog.user.toString()) {
    await Blog.findByIdAndRemove(request.params.id) 
    response.sendStatus(204).end()
  } else {
    response.status(401).send({
      error: 'invalid signature'
    }).end()
  }
})

blogsRouter.put('/:id', async (request, response) => {
  const body = request.body

  const blog = {
    title: body.title,
    author: body.author,
    url: body.url,
    likes: body.likes
  }

  const editedBlog = await Blog.findByIdAndUpdate(request.params.id, blog, { new: true })
  response.json(editedBlog)
})

module.exports = blogsRouter
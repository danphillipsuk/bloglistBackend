const blogsRouter = require('express').Router()
const Blog = require('../models/blog')

blogsRouter.get('/', async (request, response) => {
  const blogs = await Blog.find({})
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

    const blog = new Blog( {
      title: body.title,
      author: body.author,
      url: body.url,
      likes: 0,
      date: new Date(),
    })
    
    const savedBlog = await blog.save()
    response.json(savedBlog)
  }
})

blogsRouter.delete('/:id', async (request, response) => {
  await Blog.findByIdAndRemove(request.params.id) 
  response.sendStatus(204).end
})

// blogsRouter.put('/:id', (request, response, next) => {
//   const body = request.body

//   const note = {
//     content: body.content,
//     important: body.important,
//   }

//   Note.findByIdAndUpdate(request.params.id, note, { new: true })
//   .then(updatedNote => {
//     response.json(updatedNote)
//   })
//   .catch(error => next(error))
// })

module.exports = blogsRouter
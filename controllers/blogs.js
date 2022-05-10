const blogsRouter = require('express').Router()
const Blog = require('../models/blog')

blogsRouter.get('/', (request, response) => {
  Blog.find({}).then(blogs => {
    response.json(blogs)
  })
})

blogsRouter.get('/:id', (request, response, next) => {
  Blog.findById(request.params.id) 
    .then(blog => {
      if (blog) {
        response.json(blog)
      } else {
        response.status(404).end()
      }
    })
    .catch(error => next(error))
})

blogsRouter.post('/', (request, response, next) => {
  const body = request.body

  if (body.title === undefined || body.author === undefined) {
    response.status(400).end()
  }

  const blog = new Blog( {
    title: body.title,
    author: body.author,
    url: body.url,
    likes: 0,
    date: new Date(),
  })
  
  blog.save()
    .then(savedBlog => {
      response.json(savedBlog)
    })
    .catch(error => next(error))
})

// blogsRouter.delete('/:id', (request, response, next) => {
//   Note.findByIdAndRemove(request.params.id) 
//     .then(() => {
//       response.status(204).end()
//     })
//     .catch(error => next(error))
// })

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
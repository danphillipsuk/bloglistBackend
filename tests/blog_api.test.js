const listHelper = require('../utils/list_helper')
const mongoose = require('mongoose')
const supertest = require('supertest')
const app = require('../app')
const api = supertest(app)
const Blog = require('../models/blog')

beforeEach(async () => {
  await Blog.deleteMany({})
  await Blog.insertMany(listHelper.blogs)
})


describe('GET requests', () => {

  //Exercise 4.8 
  test('blogs are returned as json', async () => {
    await api
      .get('/api/blogs')
      .expect(200)
      .expect('Content-Type', /application\/json/)
  }, 100000)

  test('all blogs are returned (6)', async () => {
    const response = await api .get('/api/blogs')
    expect(response.body).toHaveLength(listHelper.blogs.length)
  })

  test('GET succeeds with a valid id', async () => {
    const blogsAtStart = await listHelper.blogsInDb()
    const blogToView = blogsAtStart[0]

    const resultBlog = await api
      .get(`/api/blogs/${blogToView.id}`)
      .expect(200)
      .expect('Content-Type', /application\/json/)

      const processedBlogToView = JSON.parse(JSON.stringify(blogToView))

      expect(resultBlog.body).toEqual(processedBlogToView)
  })

  test('GET fails with a non-valid id', async () => {
    await api
    .get('/api/blogs/nonvalidid')
    .expect(400)
  })

  // Exercise 4.9
  test('Unique identifier (id) is defined', async () => {
    const response = await api .get('/api/blogs')
    expect(response.body[0].id).toBeDefined()
  }) 

}) 

describe('POST requests', () => {
// Exercise 4.10
  test('a valid blog can be added', async () => {
  const newBlog = {
    title: "A blog Title to Check HTTP Post",
    author: "A. N. Author",
    url: "http://testingBackend.com",
    likes: 0
  }

  await api
    .post('/api/blogs')
    .send(newBlog)
    .expect(200)
    .expect('Content-Type', /application\/json/)

    const blogsAtEnd = await listHelper.blogsInDb()
    expect(blogsAtEnd).toHaveLength(listHelper.blogs.length + 1)
    
    const contents = blogsAtEnd.map(r => r.title)

    expect(contents).toContain(
      'A blog Title to Check HTTP Post'
    )
  })

  // Exercise 4.11
  test('Add a blog without Likes property', async () => {
    const newBlog = {
      title: "No Likes Set",
      author: "A. N. Author",
      url: "http://testingBackend.com",
    }
  
    await api
      .post('/api/blogs')
      .send(newBlog)
  
      const blogsAtEnd = await listHelper.blogsInDb()
      expect(blogsAtEnd[listHelper.blogs.length].likes).toBe(0)
  })

  // Exercise 4.12
  test('POST blog without title rejected', async () => {
    const newBlog = {
      author: "A. N. Author",
      url: "http://testingBackend.com",
    }

    await api
      .post('/api/blogs')
      .send(newBlog)  
      .expect(400)
  })
  
  test('POST blog without url rejected', async () => {
    const newBlog = {
      title: "A blog without URL",
      author: "A. N. Author",
    }

    await api
      .post('/api/blogs')
      .send(newBlog)
      .expect(400)
  })

})

// Exercise 4.13
describe('DELETE requests', () => {

  test('Does DELETE return correct response code (204)', async () => {
    const blogsAtStart = await listHelper.blogsInDb()
    const blogToDelete = blogsAtStart[0]

    await api
      .delete(`/api/blogs/${blogToDelete.id}`)
      .expect(204)
  })

  test('Does database contain one less record after HTTP DELETE request', async () => {
    const blogsAtStart = await listHelper.blogsInDb()
    const blogToDelete = blogsAtStart[0]

    await api
      .delete(`/api/blogs/${blogToDelete.id}`)

    const blogsAtEnd = await listHelper.blogsInDb()
    expect(blogsAtEnd).toHaveLength(
      listHelper.blogs.length - 1
    )
  })

  test('Does database remove the correct record after HTTP DELETE request', async () => {
    const blogsAtStart = await listHelper.blogsInDb()
    const blogToDelete = blogsAtStart[0]

    await api
      .delete(`/api/blogs/${blogToDelete.id}`)

    const blogsAtEnd = await listHelper.blogsInDb()
    const title = blogsAtEnd.map(r => r.title)

    expect(title).not.toContain(blogToDelete.title)
  })

})

// Exercise 4.14
describe('PUT requests', () => {

  test('Updating blog entry works', async () => {
    const blogsAtStart = await listHelper.blogsInDb()
    const blogToView = blogsAtStart[0]

    const blogEdits = {
      title: "Edited Title",
      author: "Edited Author",
      url: "Edited URL"
    }
  
    const resultBlog = await api
      .put(`/api/blogs/${blogToView.id}`)
      .send(blogEdits)
    expect(resultBlog.body.title).toBe(blogEdits.title)
    expect(resultBlog.body.author).toBe(blogEdits.author)
    expect(resultBlog.body.url).toBe(blogEdits.url)
  })

  test('Updating likes increases by 1', async () => {
    const blogsAtStart = await listHelper.blogsInDb()
    const blogLikes = blogsAtStart[0].likes
    const newLikeNumber = blogLikes + 1

    const likeIncrease = {
      likes: newLikeNumber
    }
  
    const resultBlog = await api
      .put(`/api/blogs/${blogsAtStart[0].id}`)
      .send(likeIncrease)
    expect(resultBlog.body.likes).toBe(blogLikes + 1)
  })



})

describe('total likes', () => {

  test('when list has only one blog, equals the likes of that', () => {
    const result = listHelper.totalLikes(listHelper.oneBlog)
    expect(result).toBe(5)
  })

  test('when list has multiple blogs, equals the likes of that', () => {
    const result = listHelper.totalLikes(listHelper.blogs)
    expect(result).toBe(36)
  })


  test('when list has no blogs, equals the likes of that', () => {
    const result = listHelper.totalLikes(listHelper.noBlogs)
    expect(result).toBe(0)
  })

})

describe('Most Popular Blog', () => {

  const res = {
    title: "Canonical string reduction",
    author: "Edsger W. Dijkstra",
    likes: 12
  }

  test('Most popular blog', () => {
    const result = listHelper.favoriteBlog(listHelper.blogs)
    expect(result).toEqual(res)
  })
})

describe('Who Has Authored The Most Blogs ', () => {

  const res = {
    author: "Robert C. Martin",
    blogs: 3
  }

  test('Most popular blog', () => {
    const result = listHelper.mostBlogs(listHelper.blogs)
    expect(result).toEqual(res)
  })
})

afterAll(() => {
  mongoose.connection.close()
})
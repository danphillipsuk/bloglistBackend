const listHelper = require('../utils/list_helper')
const mongoose = require('mongoose')
const supertest = require('supertest')
const app = require('../app')
const api = supertest(app)
const Blog = require('../models/blog')

// const initialBlogs = listHelper.blogs

beforeEach(async () => {
  await Blog.deleteMany({})

  const blogObjects = listHelper.blogs
    .map(blog => new Blog(blog))
  const promiseArray = blogObjects.map(blog => blog.save())
  await Promise.all(promiseArray)
},100000)

/* Exercise 4.8 
Use the supertest package for writing a test that makes an HTTP GET request to the /api/blogs url. Verify that the blog list application returns the correct amount of blog posts in the JSON format.
Once the test is finished, refactor the route handler to use the async/await syntax instead of promises.
*/
describe('Number of blogs | Content Type', () => {

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

})

// Exercise 4.9
describe('Unique identifier is correct', () => {

  test('Unique identifier (id) is defined', async () => {
    const response = await api .get('/api/blogs')
    expect(response.body[0].id).toBeDefined()
  })  

}) 

// Exercise 4.10
describe('Verify HTTP POST creates new blog post', () => {

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
  
})

// Exercise 4.11
describe('Verify Likes property sets to "0" when not POSTed', () => {

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
  
})

// Exercise 4.12
describe('New POSTs without title/url are rejected', () => {

  test('blog without title', async () => {
  const newBlog = {
    author: "A. N. Author",
    url: "http://testingBackend.com",
  }

  await api
    .post('/api/blogs')
    .send(newBlog)
    .expect(400)
  })

  test('blog without url', async () => {
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
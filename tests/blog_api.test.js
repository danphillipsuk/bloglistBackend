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
*/

test('all blogs are returned (6) an in the correct (JSON) format', async () => {
  const response = await api .get('/api/blogs')
  expect(response.body).toHaveLength(listHelper.blogs.length)
  expect(response.type).toBe('application/json')
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
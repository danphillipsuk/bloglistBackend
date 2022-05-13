const listHelper = require('../utils/list_helper')
const mongoose = require('mongoose')
const supertest = require('supertest')
const app = require('../app')
const api = supertest(app)
const bcrypt = require('bcrypt')
const User = require('../models/user')
const Blog = require('../models/blog')

beforeEach(async () => {
  await Blog.deleteMany({})
  await Blog.insertMany(listHelper.blogs)
})

describe('When there is initially one user in db', () => {

  test('creation succeeds with a fresh username', async () => {
    await User.deleteMany({})
    await User.insertMany(listHelper.newUser)
    const usersAtStart = await listHelper.usersInDb()

    const newUser = {
      username: 'mluukkai',
      name: 'Matti Luukkainen',
      password: 'salainen',
    }

    await api
      .post('/api/users')
      .send(newUser)
      .expect(201)
      .expect('Content-Type', /application\/json/)

    const usersAtEnd = await listHelper.usersInDb()
    expect(usersAtEnd).toHaveLength(usersAtStart.length + 1)

    const usernames = usersAtEnd.map(u => u.username)
    expect(usernames).toContain(newUser.username)
    })

    test('User creation fails with appropriate status code and message if username aready in use', async () => {
      const usersAtStart = await listHelper.usersInDb()

      const newUser = {
        username: 'root',
        name: 'Matti Luukkainen',
        password: 'salainen',
      }

      const result = await api 
        .post('/api/users')
        .send(newUser)
        .expect(400)
        .expect('Content-Type', /application\/json/)
      
      expect(result.body.error).toContain('username must be unique')

      const usersAtEnd = await listHelper.usersInDb()
      expect(usersAtEnd).toEqual(usersAtStart)
    })

    test('User creation fails if username not long enough', async () => {
      const usersAtStart = await listHelper.usersInDb()

      const newUser = {
        username: 'ro',
        name: 'Matti Luukkainen',
        password: 'salainen',
      }

      const result = await api 
        .post('/api/users')
        .send(newUser)
        .expect(400)
        .expect('Content-Type', /application\/json/)
      
      expect(result.body.error).toContain('username must be at least three characters long')

      const usersAtEnd = await listHelper.usersInDb()
      expect(usersAtEnd).toEqual(usersAtStart)
    })

    test('User creation fails if password not long enough', async () => {
      const usersAtStart = await listHelper.usersInDb()

      const newUser = {
        username: 'Test User',
        name: 'Matti Luukkainen',
        password: 'sa',
      }

      const result = await api 
        .post('/api/users')
        .send(newUser)
        .expect(400)
        .expect('Content-Type', /application\/json/)
      
      expect(result.body.error).toContain('password must be at least three characters long')

      const usersAtEnd = await listHelper.usersInDb()
      expect(usersAtEnd).toEqual(usersAtStart)
    })

    test('User creation fails if password or username blank', async () => {
      const usersAtStart = await listHelper.usersInDb()

      const newUser = {
        name: 'Matti Luukkainen',
        password: 'sa',
      }

      const result = await api 
        .post('/api/users')
        .send(newUser)
        .expect(400)
        .expect('Content-Type', /application\/json/)
      
      expect(result.body.error).toContain('Username and password cannot be blank')

      const usersAtEnd = await listHelper.usersInDb()
      expect(usersAtEnd).toEqual(usersAtStart)
    })

})



afterAll(() => {
  mongoose.connection.close()
})
const blog = require("../models/blog")
const User = require('../models/user')

const blogs = [
  {
    _id: "5a422b891b54a676234d17fa",
    title: "First class tests",
    author: "Robert C. Martin",
    url: "http://blog.cleancoder.com/uncle-bob/2017/05/05/TestDefinitions.htmll",
    likes: 10,
    __v: 0
  },
  {
    _id: "5a422a851b54a676234d17f7",
    title: "React patterns",
    author: "Michael Chan",
    url: "https://reactpatterns.com/",
    likes: 7,
    __v: 0
  },
  {
    _id: "5a422aa71b54a676234d17f8",
    title: "Go To Statement Considered Harmful",
    author: "Edsger W. Dijkstra",
    url: "http://www.u.arizona.edu/~rubinson/copyright_violations/Go_To_Considered_Harmful.html",
    likes: 5,
    __v: 0
  },
  {
    _id: "5a422b3a1b54a676234d17f9",
    title: "Canonical string reduction",
    author: "Edsger W. Dijkstra",
    url: "http://www.cs.utexas.edu/~EWD/transcriptions/EWD08xx/EWD808.html",
    likes: 12,
    __v: 0
  },
  {
    _id: "5a422ba71b54a676234d17fb",
    title: "TDD harms architecture",
    author: "Robert C. Martin",
    url: "http://blog.cleancoder.com/uncle-bob/2017/03/03/TDD-Harms-Architecture.html",
    likes: 0,
    __v: 0
  },
  {
    _id: "5a422bc61b54a676234d17fc",
    title: "Type wars",
    author: "Robert C. Martin",
    url: "http://blog.cleancoder.com/uncle-bob/2016/05/01/TypeWars.html",
    likes: 2,
    __v: 0
  }   
]

const noBlogs = []

const oneBlog = [
  {
    _id: '5a422aa71b54a676234d17f8',
    title: 'Go To Statement Considered Harmful',
    author: 'Edsger W. Dijkstra',
    url: 'http://www.u.arizona.edu/~rubinson/copyright_violations/Go_To_Considered_Harmful.html',
    likes: 5,
    __v: 0
  }
]

const totalLikes = blogs => {
  return blogs.reduce((acc, cur) => {
    return acc + cur.likes
  }, 0)
}

const favoriteBlog = blogs => {
  const mostLikes = blogs.reduce((prev, curr) => (prev.likes > curr.likes) ? prev : curr)
  const res = {
    title: mostLikes.title,
    author: mostLikes.author,
    likes: mostLikes.likes
  }
  return res
}

const mostBlogs = blogs => {
  const sortedList = blogs.map((blog) => blog.author)
  let maxFreq = 1
  let mostFreq = 0
  let item
  for (let i = 0; i < sortedList.length; i++) {
    for (let j = i; j < sortedList.length; j++) {
      if (sortedList[i] == sortedList[j])
        mostFreq++
      if (maxFreq < mostFreq) {
        maxFreq = mostFreq
        item = sortedList[i]
      }
    }
    mostFreq = 0
  }
  const res = {
    author: item,
    blogs: maxFreq
  }
  return res
}

const blogsInDb = async () => {
  const blogs = await blog.find({})
  return blogs.map(blog => blog.toJSON())
}

const usersInDb = async () => {
  const users = await User.find({})
  return users.map(u => u.toJSON())
}

const newUser = {
  username: 'root',
  name: 'root@root.comn',
  password: 'salainen',
}

module.exports = {
  totalLikes,
  favoriteBlog,
  mostBlogs,
  blogs,
  noBlogs,
  oneBlog,
  blogsInDb,
  usersInDb,
  newUser
}

const totalLikes = blogs => {
  return blogs.reduce((acc, cur) => {
    return acc + cur.likes
  }, 0)
}

const favoriteBlog = blogs => {
  const max = blogs.reduce((prev, curr) => (prev.likes > curr.likes) ? prev : curr)
  return max
}


module.exports = {
  totalLikes,
  favoriteBlog
}
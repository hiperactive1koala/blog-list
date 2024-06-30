const Blog = require('../models/blog');
const User = require('../models/user');

const initialBlogs = [
  {
    title: 'Hello World',
    author: 'Alien',
    url: "outher planets doesn't have url",
    user: '66808323c36fd4c037acd5b9',
  },
];

const initialUsers = [
  {
    username: 'Koala',
    name: 'Sezar',
    passwordHash: '$2a$10$USvYOzjKRi3MRi3MRi3MRe4VHbOcGVcI.r4Jk9fP/qYkPpEYuvt02',
  },
];

const nonExistingId = async () => {
  const blog = new Blog({ title: 'willremovesoon' });
  await blog.save();
  await blog.deleteOne();

  // eslint-disable-next-line no-underscore-dangle
  return blog._id.toString();
};

const blogsInDb = async () => {
  const blogs = await Blog.find({});
  return blogs.map((blog) => blog.toJSON());
};

const usersInDb = async () => {
  const users = await User.find({});
  return users.map((user) => user.toJSON());
};

module.exports = {
  initialBlogs, initialUsers, nonExistingId, blogsInDb, usersInDb,
};

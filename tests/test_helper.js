const Blog = require('../models/blog');

const initialNotes = [
  {
    title: 'Hello World',
    author: 'Alien',
    url: "outher planets doesn't have url",
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

module.exports = {
  initialNotes, nonExistingId, blogsInDb,
};

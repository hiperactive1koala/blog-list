const BlogsRoute = require('express').Router();
const Blog = require('../models/blog');

BlogsRoute.get('/', (request, response) => {
  Blog.find({})
    .then((blogs) => {
      response.json(blogs);
    });
});

BlogsRoute.post('/', async (request, response) => {
  const blog = new Blog(request.body);

  if (!blog.title || !blog.url) {
    response.status(400).end();
  }

  const savedBlog = await blog.save();
  response.status(201).json(savedBlog);
});

BlogsRoute.delete('/:id', async (request, response) => {
  await Blog.findByIdAndDelete(request.params.id);
  response.status(204).end();
});

BlogsRoute.put('/:id', async (request, response) => {
  // eslint-disable-next-line prefer-destructuring
  const body = request.body;

  const blog = {
    title: body.title,
    author: body.author,
    url: body.url,
    likes: body.likes,
  };

  const updatedBlog = await Blog.findByIdAndUpdate(request.params.id, blog, { new: false });
  response.status(201).json(updatedBlog);
});

module.exports = BlogsRoute;

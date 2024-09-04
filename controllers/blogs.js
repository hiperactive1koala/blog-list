/* eslint-disable no-underscore-dangle */
// eslint-disable-next-line import/no-extraneous-dependencies
const BlogsRoute = require('express').Router();
const Blog = require('../models/blog');
const middleware = require('../utils/middleware');

BlogsRoute.get('/', async (request, response) => {
  const blogs = await Blog
    .find({})
    .populate('user', { username: 1, name: 1 });
  response.json(blogs);
});

BlogsRoute.post('/', middleware.userExtractor, async (request, response) => {
  const { body, user } = request;

  const blog = new Blog({
    title: body.title,
    author: body.author,
    url: body.url,
    likes: body.likes,
    user,
  });

  if (!blog.title || !blog.url) {
    return response.status(400).end();
  }

  const savedBlog = await blog.save();
  user.blogs = user.blogs.concat(savedBlog._id);
  await user.save();

  return response.status(201).json(savedBlog).end();
});

BlogsRoute.delete('/:id', middleware.userExtractor, async (request, response) => {
  const blog = await Blog.findById(request.params.id);
  const { user } = request;

  if (blog.user.toString() === user.id) {
    await blog.deleteOne();
    return response.status(204).end();
  }
  return response.status(400).json({ error: 'not authorized user' }).end();
});

BlogsRoute.put('/:id', middleware.userExtractor, async (request, response) => {
  const { body } = request;
  const { user } = request;

  const blog = {
    title: body.title,
    author: body.author,
    url: body.url,
    likes: body.likes,
    user: body.user.id,
  };

  if (user) {
    const updatedBlog = await Blog.findByIdAndUpdate(request.params.id, blog, { new: true });
    updatedBlog.save()
    return response.status(201).json(updatedBlog);
  }
  return response.status(400).json({ error: 'not authorized user' }).end();
});

BlogsRoute.post('/:id/comments', async (request, response) => {
  const { body } = request;
  
  const foundBlog = await Blog.findById(body.id)
  if( !foundBlog.comments) foundBlog.comments = []
  
  const changedBlog = await Blog.findByIdAndUpdate(body.id, {comments: [...foundBlog.comments, body.comment]}, {new: true})
  await changedBlog.save()

  return response.status(200).send(changedBlog);
})

module.exports = BlogsRoute;

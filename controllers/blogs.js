/* eslint-disable no-underscore-dangle */
// eslint-disable-next-line import/no-extraneous-dependencies
const BlogsRoute = require('express').Router();
const Blog = require('../models/blog');

// const getTokenAuthorization = (request) => {
//   const authorization = request.get('authorization');
//   if (authorization && authorization.startsWith('Bearer ')) {
//     return authorization.replace('Bearer ', '');
//   }
// };

BlogsRoute.get('/', async (request, response) => {
  const blogs = await Blog
    .find({})
    .populate('user', { username: 1, name: 1 });
  response.json(blogs);
});

BlogsRoute.post('/', async (request, response) => {
  const { body } = request;

  // const decodedToken = jwt.verify(body.token, process.env.SECRET);
  // if (!decodedToken.id) {
  //   return response.status(401).json({ error: 'invalid token' }).end();
  // }
  // const user = await User.findById(decodedToken.id);

  const { user } = request;
  const blog = new Blog({
    title: body.title,
    author: body.author,
    url: body.url,
    likes: body.likes,
    user: user.id,
  });

  if (!blog.title || !blog.url) {
    return response.status(400).end();
  }

  const savedBlog = await blog.save();
  user.blogs = user.blogs.concat(savedBlog._id);
  await user.save();

  return response.status(201).json(savedBlog).end();
});

BlogsRoute.delete('/:id', async (request, response) => {
  // const decodedToken = jwt.verify(request.body.token, process.env.SECRET);
  // if (!decodedToken.id) {
  //   return response.status(401).json({ error: 'invalid token' });
  // }
  const blog = await Blog.findById(request.params.id);
  const { user } = request;
  if (blog.user.toString() === user.id) {
    await blog.deleteOne();
    return response.status(204).end();
  }
  return response.status(400).json({ error: 'not authorized user' }).end();
});

BlogsRoute.put('/:id', async (request, response) => {
  // eslint-disable-next-line prefer-destructuring
  const body = request.body;

  const blog = {
    title: body.title,
    author: body.author,
    url: body.url,
    likes: body.likes,
    user: body.user.id,
  };

  const updatedBlog = await Blog.findByIdAndUpdate(request.params.id, blog, { new: true });
  // console.log(updatedBlog);
  response.status(201).json(updatedBlog);
});

module.exports = BlogsRoute;

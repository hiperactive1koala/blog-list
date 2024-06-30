/* eslint-disable no-restricted-syntax */
const { test, after, beforeEach } = require('node:test');
const assert = require('node:assert');

const mongoose = require('mongoose');
// eslint-disable-next-line import/no-extraneous-dependencies
const supertest = require('supertest');

const app = require('../app');

const api = supertest(app);

const helper = require('./test_helper');
const Blog = require('../models/blog');

beforeEach(async () => {
  await Blog
    .deleteMany({})
    .set({ Authorization: process.env.TEST_TOKEN });

  for (const blog of helper.initialBlogs) {
    const blogObject = new Blog(blog);
    // eslint-disable-next-line no-await-in-loop
    await blogObject
      .set({ Authorization: process.env.TEST_TOKEN })
      .save();
  }
});

test('blog api get test', async () => {
  await api
    .get('/api/blogs')
    .set({ Authorization: process.env.TEST_TOKEN })
    .expect(200)
    .expect('Content-Type', /application\/json/);
});

test('blog api post test', async () => {
  const blog = {
    title: 'Tons of Error',
    author: 'An idiot',
    url: 'anidiot.com',
    user: '667b3e014817d8b4fd1f6d3a',
  };

  await api
    .post('/api/blogs')
    .send(blog)
    .set({ Authorization: process.env.TEST_TOKEN })
    .expect(201)
    .expect('Content-Type', /application\/json/);
  const blogsAtEnd = await helper.blogsInDb();
  assert.strictEqual(blogsAtEnd.length, helper.initialBlogs.length + 1);
});

test('unique identifier test', async () => {
  const response = await api
    .get('/api/blogs')
    .set({ Authorization: process.env.TEST_TOKEN });

  assert(response.body.map((e) => Object.prototype.hasOwnProperty.call(e, 'id')));
});

test('missing likes be zero', async () => {
  const response = await api
    .get('/api/blogs')
    .set({ Authorization: process.env.TEST_TOKEN });

  const likes = response.body.map((e) => e.likes);
  likes.forEach((e) => {
    assert.deepStrictEqual(e, 0);
  });
});

test('missing url or title return 400', async () => {
  const blog = {
    author: 'An idiot',
    url: 'anidiot.com',
  };

  await api
    .post('/api/blogs')
    .send(blog)
    .set('Authorization', process.env.TEST_TOKEN)
    .expect(400);
});

test('a blog can be delete', async () => {
  const blogsAtStart = await helper.blogsInDb();
  const blogToDelete = blogsAtStart[0];

  await api
    .delete(`/api/blogs/${blogToDelete.id}`)
    .set('Authorization', process.env.TEST_TOKEN)
    .expect(204);

  const blogsAtEnd = await helper.blogsInDb();
  const ids = blogsAtEnd.map((blog) => blog.id);

  assert(!ids.includes(blogToDelete.id));
});

test('updating the information of an individual blog post', async () => {
  const blogsAtStart = await helper.blogsInDb();
  const blogToUpdate = blogsAtStart[0];

  blogToUpdate.likes = 500;
  await api
    .put(`/api/blogs/${blogToUpdate.id}`)
    .send(blogToUpdate)
    .set('Authorization', process.env.TEST_TOKEN)
    .expect(201);

  const blogsAtEnd = await helper.blogsInDb();

  assert.deepStrictEqual(blogToUpdate.likes, blogsAtEnd[0].likes);
});

after(async () => {
  await mongoose.connection.close();
});

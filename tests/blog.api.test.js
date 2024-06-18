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
  await Blog.deleteMany({});
  //   console.log('cleared');

  for (const blog of helper.initialNotes) {
    const blogObject = new Blog(blog);
    // eslint-disable-next-line no-await-in-loop
    await blogObject.save();
    // console.log('saved');
  }
//   console.log('done');
});

test('blog api get test', async () => {
  await api.get('/api/blogs')
    .expect(200)
    .expect('Content-Type', /application\/json/);
});

test('blog api post test', async () => {
  const blog = {
    title: 'Tons of Error',
    author: 'An idiot',
    url: 'anidiot.com',
  };

  await api
    .post('/api/blogs')
    .send(blog)
    .expect(201)
    .expect('Content-Type', /application\/json/);

  const blogsAtEnd = await helper.blogsInDb();
  assert.strictEqual(blogsAtEnd.length, helper.initialNotes.length + 1);
});

test('unique identifier test', async () => {
  const response = await api.get('/api/blogs');

  assert(response.body.map((e) => Object.prototype.hasOwnProperty.call(e, 'id')));
});

test('missing likes be zero', async () => {
  const response = await api.get('/api/blogs');

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
    .expect(400);
});

test('a blog can be delete', async () => {
  const blogsAtStart = await helper.blogsInDb();
  const blogToDelete = blogsAtStart[0];

  await api
    .delete(`/api/blogs/${blogToDelete.id}`)
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
    .expect(201);

  const blogsAtEnd = await helper.blogsInDb();

  assert.deepStrictEqual(blogToUpdate.likes, blogsAtEnd[0].likes);
});

after(async () => {
  await mongoose.connection.close();
});

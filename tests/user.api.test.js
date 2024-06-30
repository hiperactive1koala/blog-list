/* eslint-disable no-await-in-loop */
const { test, after, beforeEach } = require('node:test');
const assert = require('node:assert');

const mongoose = require('mongoose');
// eslint-disable-next-line import/no-extraneous-dependencies
const supertest = require('supertest');

const app = require('../app');

const api = supertest(app);

const helper = require('./test_helper');
const User = require('../models/user');

beforeEach(async () => {
  await User.deleteMany({});
  // eslint-disable-next-line no-restricted-syntax
  for (const user of helper.initialUsers) {
    const userObject = new User(user);
    await userObject.save();
  }
});

test('short username or password return 400', async () => {
  const invalidUser = {
    username: 'Lo',
    name: 'who',
    passwordHash: 'me',
  };

  const usersAtStart = await User.find({});
  await api
    .post('/api/users')
    .send(invalidUser)
    .expect(400);

  const userAtEnd = await User.find({});
  assert.deepStrictEqual(usersAtStart.length, userAtEnd.length);
});

after(async () => {
  await mongoose.connection.close();
});

const express = require('express');
require('express-async-errors');

const app = express();
const cors = require('cors');
const mongoose = require('mongoose');
const config = require('./utils/config');
const middleware = require('./utils/middleware');
const logger = require('./utils/logger');
const BlogsRoute = require('./controllers/blogs');
const userRouter = require('./controllers/users');
const loginRouter = require('./controllers/login');

mongoose.set('strictQuery', false);

logger.info('connecting to', config.MONGODB_URI);

mongoose.connect(config.MONGODB_URI)
  .then(() => {
    logger.info('connected to MongoDB');
  })
  .catch((error) => {
    logger.error('error connecting to MongoDB:', error.message);
  });

app.use(cors());
app.use(express.json());
// app.use(middleware.requestLogger);

app.use('/api/login', loginRouter);
app.use('/api/blogs', middleware.tokenExtractor, BlogsRoute);
app.use('/api/users', userRouter);

// app.use(middleware.unknownEndpoint);
app.use(middleware.errorHandler);

module.exports = app;

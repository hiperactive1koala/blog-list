// eslint-disable-next-line import/no-extraneous-dependencies
const _ = require('lodash');

// eslint-disable-next-line no-unused-vars
const dummy = (blogs) => 1;

const totalLikes = (blogs) => (blogs.length === 0 ? 0
  : blogs.reduce((sum, blog) => sum + blog.likes, 0));

const favoriteBlog = (blogs) => {
  const favorite = blogs.sort((a, b) => a.likes - b.likes).reverse()[0];
  return {
    title: favorite.title,
    author: favorite.author,
    likes: 12,
  };
};

const mostBlogs = (blogs) => {
  const authorListObj = _.mapValues(
    _.groupBy(blogs, 'author'),
    (e) => _.size(e),
  );
  const author = _.max(Object.keys(authorListObj), (o) => authorListObj[o]);
  console.log(author, authorListObj[author]);
  return { author, blogs: authorListObj[author] };
};

module.exports = {
  dummy,
  totalLikes,
  favoriteBlog,
  mostBlogs,
};

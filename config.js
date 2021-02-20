/* eslint-disable strict */
require('dotenv').config();

module.exports = {
  PORT: process.env.PORT || 8081,
  NODE_ENV: process.env.NODE_ENV,
  DB_URL: process.env.DB_URL || 'postgresql://postgres@localhost/noteful',
};
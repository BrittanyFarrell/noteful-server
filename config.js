/* eslint-disable strict */
require('dotenv').config();

module.exports = {
  PORT: process.env.PORT || 8081,
  NODE_ENV: process.env.NODE_ENV,
  DATABASE_URL: process.env.DATABASE_URL,
};
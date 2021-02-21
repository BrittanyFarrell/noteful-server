/* eslint-disable strict */
require('dotenv').config();

module.exports = {
  PORT: process.env.PORT || 8081,
  NODE_ENV: process.env.NODE_ENV,
  DATABASE_URL: process.env.DATABASE_URL || 'postgres://oigxtxijbxrmex:b07dca1e51827547b8fb13aa22a708c86c923806d08c0b8dc8b4d72f0a8523b4@ec2-34-239-33-57.compute-1.amazonaws.com:5432/d6eah4tt96huv8',
};
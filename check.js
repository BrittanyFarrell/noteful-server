/* eslint-disable strict */
require('dotenv').config();

const db = knex({
  client: 'pg',
  connection: process.env.DATABASE_URL
});

console.log(db);
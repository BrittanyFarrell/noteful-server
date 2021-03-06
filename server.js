/* eslint-disable strict */
const{ PORT, DATABASE_URL } = require('./config');

const knex = require('knex');

const app = require('./src/app');

if (process.env.NODE_ENV === "production") {
  const pg = require('pg');
  pg.defaults.ssl = { rejectUnauthorized: false }
}

const db = knex({
  client: 'pg',
  connection: DATABASE_URL
});

app.set('db', db);
  
app.use((error, req, res, next) => {
  let response;
  if (process.env.NODE_ENV === 'production') {
    response = { error: { message: 'server error' }};
  } else {
    response = { error };
  }
  res.status(500).json(response);
});

app.listen(PORT, () => {
  console.log('Server is listening');
});
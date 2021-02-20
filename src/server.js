/* eslint-disable strict */
const{ PORT, DB_URL } = require('../config');

const knex = require('knex');

const app = require('./app');

const db = knex({
  client: 'pg',
  connection: DB_URL,
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
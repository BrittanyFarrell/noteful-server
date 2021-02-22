/* eslint-disable strict */
const knex = require('knex');
const app = require('../src/app');
const supertest = require('supertest');
const helpers = require('./test-helpers');

describe('Folders Endpoints', function() {
  let db;

  const {
    testFolders, 
    testNotes
  } = helpers.createTestData();

  before('make knex instance', () => {
    db = knex({
      client: 'pg',
      connection: process.env.DATABASE_TEST_URL,
    });
    app.set('db', db);
  });

  after('disconnect from db', () => db.destroy());

  before('cleanup', () => helpers.cleanTables(db));

  afterEach('cleanup', () => helpers.cleanTables(db));

  describe('GET /api/folders', () => {
    context('folders table empty', () => {
      it('responds with status 200 and an empty array', () => {
        return supertest(app)
          .get('/api/folders')
          .expect(200, []);
      });
    });

    context('content in folders table', () => {
      beforeEach('insert folders', () =>
        helpers.seedTables(
          db, testFolders, testNotes
        )
      );

      it('responds with status 200 and a complete list of folders', () => {
        const expectedFolders = testFolders.map(folder => 
          helpers.makeExpectedFolder(
            folder, testNotes
          )  
        );

        return supertest(app)
          .get('/api/folders')
          .expect(200, expectedFolders);
      });
    });
  });

  describe('POST /api/folders', () => {
    beforeEach('clean', () => helpers.cleanTables(db));
    context('Given no name in request body', () => {
      it('responds with status 400 and error message', () => {
        return supertest(app)
          .post('/api/folders')
          .expect(400, {
            error: 'Missing \'name\' in request body'
          });
      });
    });

    context('With name in request body', () => {
      it('responds with 201 and new folder info', () => {
        const expectedFolder = helpers.makeExpectedFolder({id:1, name:'test-folder'});
        return supertest(app)
          .post('/api/folders')
          .send({name:'test-folder'})
          .expect(201, expectedFolder);
      });
    });
  });

  describe('GET /api/folders/:folder_id', () => {
    
    beforeEach('insert folders', () =>
      helpers.seedTables(
        db, testFolders, testNotes
      )
    );

    afterEach('clean', () =>
      helpers.cleanTables(db)
    );

    context('folder doesn\'t exist', () => {
      it('responds with status 404 and an error message', () => {
        return supertest(app)
          .get('/api/folders/4')
          .expect(404, {
            error: 'Folder doesn\'t exist'
          });
      });
    });

    context('folder does exist', () => {
      it('responds with status 200 and correct folder data', () => {
        const expectedFolder = helpers.makeExpectedFolder(testFolders[1]);  

        return supertest(app)
          .get('/api/folders/2')
          .expect(200, expectedFolder);
      });
    });
  });
});
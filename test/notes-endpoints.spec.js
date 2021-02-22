/* eslint-disable strict */
const knex = require('knex');
const app = require('../src/app');
const supertest = require('supertest');
const helpers = require('./test-helpers');
const { networkInterfaces } = require('os');

describe('Notes Endpoints', function() {
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

  describe('GET /api/notes', () => {
    context('notes table empty', () => {
      it('responds with status 200 and an empty array', () => {
        return supertest(app)
          .get('/api/notes')
          .expect(200, []);
      });
    });

    context('content in notes table', () => {
      beforeEach('insert notes', () =>
        helpers.seedTables(
          db, testFolders, testNotes
        )
      );

      it('responds with status 200 and a complete list of notes', () => {
        const expectedNotes = testNotes.map(note => 
          helpers.makeExpectedNote(note)  
        );

        return supertest(app)
          .get('/api/notes')
          .expect(200, expectedNotes);
      });
    });
  });

  describe('POST /api/notes', () => {
    
    beforeEach('seed tables', () =>helpers.seedTables(
      db, testFolders, testNotes
    ));
    afterEach('clean tables', () =>helpers.cleanTables(db));
    context('Missing part of request body', () => {
      it('responds with 400 and error message when missing name', () => {
        return supertest(app) 
          .post('/api/notes')
          .send({
            content: 'this is a test note',
            folder_id: 1,
            date_modified: '2021-02-21T22:19:58.495Z'
          })
          .expect(400, {
            error: 'Request body must include a name, content, folder_id, and date_modified'
          });
      });

      it('responds with 400 and error message when missing content', () => {
        return supertest(app) 
          .post('/api/notes')
          .send({
            name: 'test-note',
            folder_id: 1,
            date_modified: '2021-02-21T22:19:58.495Z'
          })
          .expect(400, {
            error: 'Request body must include a name, content, folder_id, and date_modified'
          });
      });

      it('responds with 400 and error message when missing folder_id', () => {
        return supertest(app) 
          .post('/api/notes')
          .send({
            name: 'test-note',
            content: 'this is a test note',
            date_modified: '2021-02-21T22:19:58.495Z'
          })
          .expect(400, {
            error: 'Request body must include a name, content, folder_id, and date_modified'
          });
      });

      it('responds with 400 and error message when missing date_modified', () => {
        return supertest(app) 
          .post('/api/notes')
          .send({
            name: 'test-note',
            content: 'this is a test note',
            folder_id: 1
          })
          .expect(400, {
            error: 'Request body must include a name, content, folder_id, and date_modified'
          });
      });
    });

    context('request contains all nesecary components', () => {
      it('responds with status 201 and new note data', () => {
        const body = {
          id: 9,
          name: 'test-note',
          content: 'this is a test note',
          folder_id: 1,
          date_modified: '2021-02-21T22:19:58.495Z'
        };
        const expectedNote = helpers.makeExpectedNote(body);
        return supertest(app) 
          .post('/api/notes')
          .send({
            'name': 'test-note',
            'content': 'this is a test note',
            'folder_id': 1,
            'date_modified': '2021-02-21T22:19:58.495Z'
          })
          .expect(201, expectedNote);
      });
    });
  });

  describe('GET /api/notes/:note_id', () => {
    describe('empty notes folder', () => {
      it('responds with 404 and error message', () => {
        return supertest(app)
          .get('/api/notes/2')
          .expect(404, {error: 'Note doesn\'t exist'});
      });
    });

    describe('content in notes folder', () => {
      beforeEach('seed tables', () =>helpers.seedTables(
        db, testFolders, testNotes
      ));
      afterEach('clean tables', () =>helpers.cleanTables(db));

      it('responds with 404 and error message if the note does not exist', () => {
        return supertest(app)
          .get('/api/notes/9')
          .expect(404, {error: 'Note doesn\'t exist'});
      });

      it('responds with 200 and correct note if the note exists', () => {
        const expectedNote = testNotes[6];
        return supertest(app)
          .get('/api/notes/7')
          .expect(200, expectedNote);
      });
    });
  });

  describe.only('DELETE /api/notes/:note_id', () => {
    
    beforeEach('seed tables', () =>helpers.seedTables(
      db, testFolders, testNotes
    ));
    afterEach('clean tables', () =>helpers.cleanTables(db));

    describe('if the note doesn\'t exists', () => {
      return supertest(app)
        .delete('/api/notes/12')
        .expect(404, {error: 'Note doesn\'t exist'});
    });

    describe('if the note does exist', () => {
      return supertest(app)
        .delete('/api/notes/1')
        .expect(204, {message: 'the note has been deleted'});
    });
  });
});
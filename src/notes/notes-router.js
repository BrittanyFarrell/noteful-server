/* eslint-disable strict */
const express = require('express');
const NotesService = require('./notes-service');
const jsonBodyParser = express.json();
const logger = require('../logger');
const notesRouter = express.Router();

notesRouter
  .route('/')
  .get((req, res, next) => {
    NotesService.getAllNotes(req.app.get('db'))
      .then(notes => {
        res.json(notes);
      })
      .catch(next);
  })
  .post(jsonBodyParser, (req, res, next) => {
    const { name, content, folder_id, date_modified } = req.body;
    const newNote = { name, content, folder_id, date_modified };

    if (!name || !content || !folder_id || !date_modified ) {
      logger.error('missing part of request body');
      return res.status(400).json({
        error: 'Request body must include a name, content, folder_id, and date_modified'
      });
    }

    NotesService.insertNote(req.app.get('db'), newNote)
      .then(note => {
        res
          .status(201)
          .location(`/notes/${note.id}`)
          .json(note);
      })
      .catch(next);
  });


notesRouter
  .route('/:note_id')
  .get((req, res, next) => {

    const id = req.params.note_id;
    NotesService.getById(req.app.get('db'), id)
      .then(note => {
        if (!note) {
          logger.error('note does not exist');
          return res.status(404).json({error: 'Note doesn\'t exist'});
        }
        if (note) {
          const serialNote = NotesService.serializeNote(note);
          return res.json(serialNote);
        }
      })
      .catch(next);
  })
  .delete((req, res, next) => {
    const id = req.params.note_id;
    NotesService.deleteById(req.app.get('db'), id)
      .then(note => {
        if (!note) {
          logger.error('note does not exist');
          return res.status(404).json({error: 'Note doesn\'t exist'});
        }
        if (note) {
          logger.info('note successfully deleted');
          return res.status(204).json({message: 'the note has been deleted'});
        }
      })
      .catch(next);
  });


module.exports = notesRouter;

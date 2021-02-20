/* eslint-disable strict */
const xss = require('xss');

const NotesService = {
  getAllNotes(db) {
    return db
      .from('notes')
      .select('*')
      .then(notes => {
        return notes;
      });
  },

  getById(db, id) {
    return db
      .from('notes')
      .select('*')
      .where('id', id)
      .first()
      .then(notes => {
        return notes;
      });
  },

  serializeNote(note) {
    return {
      id: note.id,
      name: xss(note.name),
      folder_id: note.folder_id,
      content: xss(note.content),
      date_modified: new Date(note.date_modified)
    };
  },

  deleteById(db, id) {
    return db
      .select('*')
      .from('notes')
      .where('id', id)
      .del()
      .then(res => res);
  },

  insertNote(db, note) {
    return db
      .insert(note)
      .into('notes')
      .returning('*')
      .then(rows => rows[0]);
  }
};

module.exports = NotesService;
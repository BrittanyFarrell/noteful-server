/* eslint-disable strict */
const xss = require('xss');

const FoldersService = {
  getAllFolders(db) {
    return db
      .from('folders')
      .select('*')
      .then(folders => {
        return folders;
      });
  },

  getById(db, id) {
    return db
      .from('folders')
      .select('*')
      .where('id', id)
      .first()
      .then(folders => {
        return folders;
      });
  },

  insertFolder(db, folder) {
    return db
      .insert(folder)
      .into('folders')
      .returning('*')
      .then(rows => rows[0]);
  },

  serializeFolder(folder) {
    return {
      id: folder.id,
      name: xss(folder.name)
    };
  }
};

module.exports = FoldersService;
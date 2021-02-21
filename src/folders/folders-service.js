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
    console.log('insertFolder knex reahed');
    console.log('folder:', folder);
    console.log(' ');
    console.log(' ');
    console.log(' ');
    console.log(' ');
    console.log('database:', db.name);
    console.log(' ');
    console.log(' ');
    console.log(' ');
    console.log(' ');
    return db;
      // .insert(folder)
      // .into('folders')
      // .returning('*')
      // .then(rows => {
      //   console.log('row', rows[0]);
      //   return rows[0];
      // });
  },

  serializeFolder(folder) {
    return {
      id: folder.id,
      name: xss(folder.name)
    };
  }
};

module.exports = FoldersService;
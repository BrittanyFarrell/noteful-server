/* eslint-disable strict */
const express = require('express');
const FoldersService = require('./folders-service');
const logger = require('../logger');
const jsonBodyParser = express.json();
const foldersRouter = express.Router();

foldersRouter
  .route('/')
  .get((req, res, next) => {
    FoldersService.getAllFolders(req.app.get('db'))
      .then(folders => {
        res.json(folders);
      })
      .catch(next);
  })
  .post(jsonBodyParser, (req, res, next) => {
    const { name } = req.body;

    console.log('post request reached');
    if (!name) {
      logger.error('Missing \'name\' in request body');
      return res.status(400).json({
        error: 'Missing \'name\' in request body'
      });
    }

    FoldersService.insertFolder(req.app.get('db'), { name })
      .then(folder => {
        
        console.log('insert folder complete, returning new folder');
        res
          .status(201)
          .location(`/folders/${folder.id}`)
          .json(folder);
      })
      .catch(next);
  });

foldersRouter
  .route('/:folder_id')
  .get((req, res, next) => {
    const id = req.params.folder_id;
    FoldersService.getById(req.app.get('db'), id)
      .then(folder => {
        if (!folder) {
          logger.error('Folder doesn\'t exist');
          return res.status(404).json({error: 'Folder doesn\'t exist'});
        }
        if (folder) {
          const serialFolder = FoldersService.serializeFolder(folder);
          return res.json(serialFolder);
        }
      })
      .catch(next);
  });

module.exports = foldersRouter;

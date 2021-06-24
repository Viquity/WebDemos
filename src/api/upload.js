const express = require('express');
const multer = require('multer');
const uuid = require('uuid').v4;
const path = require('path');
const fs = require('fs');
require('dotenv').config();

const router = express.Router();

const demoDir = `${__dirname}../../../public/demos`;
const tmpDir = `${__dirname}../../../tmp`;

const storage = multer.diskStorage({
  destination: (req, file, callback) => {
    callback(null, 'tmp');
  },
  filename: (req, file, callback) => {
    callback(null, `${Date.now()}-${file.originalname}`);
  },
});

const upload = multer({
  storage,
  fileFilter(req, file, callback) {
    const ext = path.extname(file.originalname);
    if (ext !== '.dem' && ext !== '.zip') {
      return callback(new Error('Only .dem and .zip files are allowed!'));
    }
    callback(null, true);
  }
});

// Middleware wasn't loading from the file so have to reference it here.
function authorizeUser(req, res, next) {
  if (req.headers.authorization !== process.env.API_KEY) {
    return res.json({
      message: 'Invalid or Missing API Key.'
    });
  }
  next();
}

/*
    File upload works but creating the serverID directory has to be done manually at the moment.
    TODO: Rework the absolute/relative paths as right now they're super jank.
*/
router.post('/', authorizeUser, upload.any('demoFile'), (req, res, next) => {
  try {
    const demoFilename = req.files[0].filename;
    const { serverID } = req.body;
    console.log(demoFilename);

    fs.copyFile(`${tmpDir}/${demoFilename}`, `${demoDir}/${serverID}/${demoFilename}`, (err) => {
      if (err) {
        return res.json({
          message: 'Failed to copy demo to public directory.'
        });
      }
      console.log(`${demoFilename} was copied!`);
      try {
        fs.unlinkSync(`${tmpDir}/${demoFilename}`);
        console.log('Successfully deleted the file after copy.');
      } catch (err) {
        return next(error);
      }
    });
    res.json({
      message: 'File uploaded!'
    });
  } catch (error) {
    return next(error);
  }
});

module.exports = router;

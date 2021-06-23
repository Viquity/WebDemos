const express = require('express');
const multer = require('multer');
const uuid = require('uuid').v4;
const path = require('path');
const fs = require('fs');
require('dotenv').config();

const router = express.Router();

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
    File upload works but I'm unable to get the new demo file name. Maybe because it hasn't completed the copy yet?
*/
router.post('/', authorizeUser, upload.any('demoFile'), (req, res, next) => {
  try {
    let demoFilename = req.files.filename
    const serverID = req.body.serverID;
    const demoDir = __dirname + '../../public/demos'
    console.log(demoFilename)
    res.json({
        message: "File uploaded!"
    })

  } catch (error) {
    return next(error);
  }
});

module.exports = router;

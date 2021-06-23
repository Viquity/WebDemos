const express = require('express');
const multer = require('multer');
const uuid = require('uuid').v4;
const path = require('path');
require('dotenv').config()

const router = express.Router();

const storage = multer.diskStorage({
    destination: (req, file, callback) => {
        callback(null, 'public/demos');
    },
    filename: (req, file, callback) => {
        callback(null, Date.now() + "-" + file.originalname);
    },
})

const upload = multer({ 
    storage: storage,
    fileFilter: function (req, file, callback) {
        var ext = path.extname(file.originalname);
        if(ext !== '.dem' && ext !== '.zip') {
            return callback(new Error('Only .dem and .zip files are allowed!'))
        }
        callback(null, true)
    }
});

// Middleware wasn't loading from the file so have to reference it here.
function authorizeUser(req, res, next) {
    if (req.headers.authorization != process.env.API_KEY) {
        return res.json({
            message: "Invalid or Missing API Key."
        });
    } else {
    next();
    }
}

/*
    Authentication works now. Need to add additional fields for information like the map. 
    Need to check if the file upload is asynchronous because right now I don't think it is.  
*/
 router.post('/', authorizeUser, upload.single('demoFile'), async (req, res, next) => {
    try {
      res.json({
          message: "Demo Uploaded Sucessfully!",
      })
    } catch (error) {
        return next(error);
        }
    });

module.exports = router;

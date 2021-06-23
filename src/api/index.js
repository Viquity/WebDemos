const express = require('express');

const emojis = require('./emojis');

const upload = require('./upload');

const router = express.Router();

router.get('/', (req, res) => {
  res.json({
    message: 'API Route 👋🌎'
  });
});

router.use('/emojis', emojis); // leaving this here for reference to create new routes if needed.
router.use('/upload', upload);

module.exports = router;

const express = require('express');

const router = express.Router();

router.get('/', (req, res) => {
  res.json(['😀', '😳', '🙄']);
});

module.exports = router;
// leaving this here for reference to create new routes if needed.

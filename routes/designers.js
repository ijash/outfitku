const auth = require('../middleware/auth');
const express = require('express');
const router = express.Router();

router.get('/', /* auth, */ async (req, res) => {
    // TO DO...........
    console.log('fill in with task....')
    res.send('work in progress..........')
});

module.exports = router; 
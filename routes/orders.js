const auth = require('../middleware/auth');
const express = require('express');
const router = express.Router();

router.get('/', auth, async (req, res) => {
    // TO DO...........
    console.log('fill in with task....')
    res.send('work in progress..........')
});

router.post('/', auth, async (req, res) => {
    // TO DO...........
    console.log('fill in with task....')
    res.send('work in progress..........')
});

router.delete('/', auth, async (req, res) => {
    // TO DO...........
    console.log('fill in with task....')
    res.send('work in progress..........')
});

router.put('/', auth, async (req, res) => {
    // TO DO...........
    console.log('fill in with task....')
    res.send('work in progress..........')
});


router.get('/:id', auth, async (req, res) => {
    // TO DO...........
    console.log('fill in with task....')
    res.send('work in progress..........')
});


module.exports = router; 
const express = require('express');
const auth = require('../middleware/auth');
const config = require('config');
const fs = require('fs')
const multer = require('multer')
const { User } = require('../models/user');
const { Textile, validate } = require('../models/textile');
const _ = require('lodash');
const router = express.Router();

const path = `${config.get('saveImg')}textiles/`

const storage = multer.diskStorage({
  destination: function(req, file, cb) { // define target path
    if (!fs.existsSync(`${path}`)) {
      fs.mkdirSync(`${path}`)
    }
    cb(null, path);
  },
  filename: function(req, file, cb) {
    cb(null, `${req.body.name.trim()}.jpg`); // define saved file name
  }
});

const upload = multer({ storage: storage }); // use limit: {fileSize: to define max fileSize}

router.get('/', async (req, res) => {
  const textile = await Textile.find();
  res.send(textile)
});

router.get('/:id', async (req, res) => {
  const textile = await Textile.findById(req.params._id);
  res.send(textile)
});

router.post('/', [auth, upload.single('image')], async (req, res) => {
  const { error } = validate(req.body);
  if (error) return res.status(400).send(error.details[0].message);

  const user = await User.findById(req.user._id).select('name isAdmin')
  if (!user.isAdmin) return res.status(403).send("Unauthorized to add new textile");

  const isDuplicate = await Textile.findOne({ name: req.body.name.trim() })
  if (isDuplicate) return res.status(409).send('cannot insert duplicated entry, conflicting with an existing textile.')

  const textile = new Textile({
    name: req.body.name.trim(),
    image: req.file.filename
  });
  await textile.save();
  res.send(textile)
});

router.delete('/', auth, async (req, res) => {
  const { error } = validate(req.body);
  if (error) return res.status(400).send(error.details[0].message);

  const user = await User.findById(req.user._id).select('name isAdmin')
  if (!user.isAdmin) return res.status(403).send("Unauthorized to add new textile");

  let textile = await Textile.findOne({ name: req.body.name.trim() })
  if (!textile) return res.status(404).send('No textile found with the given name');

  textile = await Textile.findOneAndRemove({ name: req.body.name.trim() })

  res.send(textile)
});

module.exports = router;
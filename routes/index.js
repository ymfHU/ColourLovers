var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'ColourLovers.', title2: 'Live.' });
});

module.exports = router;

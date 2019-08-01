var express = require('express');
var db = require('../db');

var router = express.Router();

/* GET api home page. */
router.get('/', function(req, res, next) {
  res.json('payor api index');
});

module.exports = router;

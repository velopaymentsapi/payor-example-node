var express = require('express');
var router = express.Router();

/* GET reporting index. */
router.get('/', function(req, res, next) {
  res.json('reporting index');
});

module.exports = router;

var express = require('express');
var router = express.Router();

/* GET user info. */
router.get('/', function(req, res, next) {
  res.json('user info');
});

/* POST user info. */
router.post('/', function(req, res, next) {
  res.json('updated user info');
});

module.exports = router;

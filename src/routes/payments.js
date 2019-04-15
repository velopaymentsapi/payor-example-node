var express = require('express');
var router = express.Router();

/* GET payments index. */
router.get('/', function(req, res, next) {
  res.json('payments index');
});

module.exports = router;

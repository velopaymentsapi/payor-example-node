const express = require('express');
const VeloPayments = require('velo-payments');
const velo = require('../velo');
const router = express.Router();

/* GET payees list. */
router.get('/', function(req, res, next) {
  let defaultClient = VeloPayments.ApiClient.instance;
  let OAuth2 = defaultClient.authentications['OAuth2'];
  OAuth2.accessToken = velo.getAccessToken();

  let apiInstance = new VeloPayments.PayeesApi();
  let payorId = process.env.VELO_API_PAYORID;
  let opts = {
    'pageNumber': 1,
    'pageSize': 100
  };
  apiInstance.listPayees(payorId, opts, (error, data, response) => {
    if (error) {
      console.error(error);
    } else {
      res.json(response.body);
    }
  });
});

/* POST create payees. */
router.post('/', function(req, res, next) {
  res.json('create payees');
});

/* GET payees info. */
router.get('/:payee_id', function(req, res, next) {
  res.json('payees info : ' + req.params.payee_id);
});

/* POST create remote payee onboarding. */
router.post('/:payee_id/invite', function(req, res, next) {
  res.json('create remote payee onboarding');
});

module.exports = router;
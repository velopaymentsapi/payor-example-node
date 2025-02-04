const express = require('express');
const VeloPayments = require('velo-payments');
const velo = require('../velo');
const router = express.Router();

/* GET payor velo info. */
router.get('/', async function(req, res, next) {
  let defaultClient = VeloPayments.ApiClient.instance;
  let OAuth2 = defaultClient.authentications['OAuth2'];
  OAuth2.accessToken = await velo.getAccessToken();

  let apiInstance = new VeloPayments.PayorsApi();
  let payorId = process.env.VELO_API_PAYORID;
  
  apiInstance.getPayorByIdV2(payorId, (error, data, response) => {
    if (error) {
      console.error(error);
    } else {
      res.json(response.body);
    }
  });
});

/* GET payor velo accounts. */
router.get('/accounts', async function(req, res, next) {
  let defaultClient = VeloPayments.ApiClient.instance;
  let OAuth2 = defaultClient.authentications['OAuth2'];
  OAuth2.accessToken = await velo.getAccessToken();

  let apiInstance = new VeloPayments.FundingManagerApi();
  let opts = {'payorId': process.env.VELO_API_PAYORID};
  apiInstance.getSourceAccountsV2(opts, (error, data, response) => {
    if (error) {
      console.error(error);
    } else {
      res.json({'accounts': response.body.content});
    }
  });
});

/* POST create funding request. */
router.post('/fundings', async function(req, res, next) {
  let defaultClient = VeloPayments.ApiClient.instance;
  let OAuth2 = defaultClient.authentications['OAuth2'];
  OAuth2.accessToken = await velo.getAccessToken();
  
  let apiInstance = new VeloPayments.FundingManagerApi();
  let sourceAccountId = req.body.source_account;
  let fundingRequest = new VeloPayments.FundingRequestV1();
  fundingRequest.amount = req.body.amount;
  apiInstance.createAchFundingRequest(sourceAccountId, fundingRequest, (error, data, response) => {
    if (error) {
      console.error(error);
    } else {
      res.json(response.body);
    }
  });
});

/* GET list available countries on velo. */
router.get('/countries', async function(req, res, next) {
  let defaultClient = VeloPayments.ApiClient.instance;
  let OAuth2 = defaultClient.authentications['OAuth2'];
  OAuth2.accessToken = await velo.getAccessToken();
  
  let apiInstance = new VeloPayments.CountriesApi();
  apiInstance.listSupportedCountries((error, data, response) => {
    if (error) {
      console.error(error);
    } else {
      console.log('API called successfully. Returned data: ' + data);
      res.json(response.body);
    }
  });
});

/* GET list available currencies on velo. */
router.get('/currencies', async function(req, res, next) {
  let defaultClient = VeloPayments.ApiClient.instance;
  let OAuth2 = defaultClient.authentications['OAuth2'];
  OAuth2.accessToken = await velo.getAccessToken();

  let apiInstance = new VeloPayments.CurrenciesApi();
  apiInstance.listSupportedCurrencies((error, data, response) => {
    if (error) {
      console.error(error);
    } else {
      res.json(response.body);
    }
  });
});

module.exports = router;

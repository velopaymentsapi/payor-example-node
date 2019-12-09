var express = require('express');
var router = express.Router();
const moment = require('moment-timezone');
const VeloPayments = require('velo-payments');
const velo = require('../velo');

/* POST payment create. */
router.post('/', async function(req, res, next) {
  let defaultClient = VeloPayments.ApiClient.instance;
  let OAuth2 = defaultClient.authentications['OAuth2'];
  OAuth2.accessToken = await velo.getAccessToken();

  let apiInstance = new VeloPayments.SubmitPayoutApi();
  let createPayoutRequest = new VeloPayments.CreatePayoutRequest();
  createPayoutRequest.payorId = process.env.VELO_API_PAYORID;
  createPayoutRequest.payoutMemo = "batch-"+moment().unix();

  let payments = [];
  let instruction = new VeloPayments.PaymentInstruction();
  instruction.remoteId = 
  instruction.currency = 
  instruction.amount = 
  instruction.sourceAccountName = 
  // instruction = req.body.source_account;
  payments.push(instruction);

  createPayoutRequest.payments = payments;
  res.json(createPayoutRequest);
  // apiInstance.submitPayout(createPayoutRequest, (error, data, response) => {
  //   if (error) {
  //     console.error(error);
  //   } else {
  //     console.log('API called successfully.');
  //     res.json(response.body);
  //   }
  // });
});

/* PUT payment instruct/confirm. */
router.put('/:payment_id', async function(req, res, next) {
  let defaultClient = VeloPayments.ApiClient.instance;
  let OAuth2 = defaultClient.authentications['OAuth2'];
  OAuth2.accessToken = await velo.getAccessToken();

  let apiInstance = new VeloPayments.InstructPayoutApi();
  let payoutId = req.params.payment_id;
  apiInstance.v3PayoutsPayoutIdPost(payoutId, (error, data, response) => {
    if (error) {
      console.error(error);
    } else {
      console.log('API called successfully.');
      res.json(response.body);
    }
  });
});

/* DELETE payment cancel. */
router.delete('/:payment_id', async function(req, res, next) {
  let defaultClient = VeloPayments.ApiClient.instance;
  let OAuth2 = defaultClient.authentications['OAuth2'];
  OAuth2.accessToken = await velo.getAccessToken();

  let apiInstance = new VeloPayments.WithdrawPayoutApi();
  let payoutId = req.params.payment_id;
  apiInstance.v3PayoutsPayoutIdDelete(payoutId, (error, data, response) => {
    if (error) {
      console.error(error);
    } else {
      console.log('API called successfully.');
      res.json(response.body);
    }
  });
});

/* GET payments details. */
router.get('/:payment_id', async function(req, res, next) {
  let defaultClient = VeloPayments.ApiClient.instance;
  let OAuth2 = defaultClient.authentications['OAuth2'];
  OAuth2.accessToken = await velo.getAccessToken();

  let apiInstance = new VeloPaymentsApIs.GetPayoutApi();
  let payoutId = req.params.payment_id;
  apiInstance.v3PayoutsPayoutIdGet(payoutId, (error, data, response) => {
    if (error) {
      console.error(error);
    } else {
      console.log('API called successfully. Returned data: ' + data);
      res.json(response.body);
    }
  });
});

module.exports = router;

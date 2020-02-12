const express = require('express');
const VeloPayments = require('velo-payments');
const velo = require('../velo');
const router = express.Router();
const payeeModel = require('../models/payee');

/* GET payees list. */
router.get('/', async function(req, res, next) {
  let defaultClient = VeloPayments.ApiClient.instance;
  let OAuth2 = defaultClient.authentications['OAuth2'];
  OAuth2.accessToken = await velo.getAccessToken();

  let apiInstance = new VeloPayments.PayeesApi();
  let payorId = process.env.VELO_API_PAYORID;
  let opts = {
    'pageNumber': 1,
    'pageSize': 100,
    'sort': 'displayName:desc'
  };
  apiInstance.listPayees(payorId, opts, (error, data, response) => {
    if (error) {
      console.error(error);
    } else {
      res.json(response.body);
    }
  });
  // TODO: finish support for sync sidecar
  // let page = (req.query.page !== undefined) ? parseInt(req.query.page): 1;
  // let model = new payeeModel();
  // let payees = await model.list(page);
  // res.json(payees);
});

/* POST create payees. */
router.post('/', async function(req, res, next) {
  let defaultClient = VeloPayments.ApiClient.instance;
  let OAuth2 = defaultClient.authentications['OAuth2'];
  OAuth2.accessToken = await velo.getAccessToken();
  // create payee locally
  let model = new payeeModel(req.body);
  if (model.validateCreate() !== undefined) {

  }
  model.create();

  // create payee on velo platform
  let apiInstance = new VeloPayments.PayeeInvitationApi();
  let createPayeesRequest = new VeloPayments.CreatePayeesRequest();
  createPayeesRequest.payorId = process.env.VELO_API_PAYORID;
  let payees = [];
  let createPayee = model.convertToVelo(req.body);
  payees.push(createPayee);
  createPayeesRequest.payees = payees;

  // res.json( createPayeesRequest );
  apiInstance.v2CreatePayee(createPayeesRequest, (error, data, response) => {
    if (error) {
      console.error(error);
    } else {
      console.log('API called successfully. Returned data: ' + data);
      res.json(response.body);
    }
  });
});

/* GET payees info. */
router.get('/:payee_id', async function(req, res, next) {
  let defaultClient = VeloPayments.ApiClient.instance;
  let OAuth2 = defaultClient.authentications['OAuth2'];
  OAuth2.accessToken = await velo.getAccessToken();

  let apiInstance = new VeloPayments.PayeesApi();
  let payeeId = req.params.payee_id;
  let opts = {
    'sensitive': true
  };
  apiInstance.getPayeeById(payeeId, opts, (error, data, response) => {
    if (error) {
      console.error(error);
    } else {
      console.log('API called successfully. Returned data: ' + data);
      res.json(response.body);
    }
  });
});

/* POST create remote payee onboarding. */
router.post('/:payee_id/invite', async function(req, res, next) {
  let defaultClient = VeloPayments.ApiClient.instance;
  let OAuth2 = defaultClient.authentications['OAuth2'];
  OAuth2.accessToken = await velo.getAccessToken();

  let apiInstance = new VeloPayments.PayeeInvitationApi();
  let payeeId = req.params.payee_id;
  let invitePayeeRequest = new VeloPayments.InvitePayeeRequest(process.env.VELO_API_PAYORID);
  apiInstance.resendPayeeInvite(payeeId, invitePayeeRequest, (error, data, response) => {
    if (error) {
      console.error(error);
    } else {
      console.log('API called successfully. Returned data: ' + data);
      res.json(response.body);
    }
  });
});

module.exports = router;
//
require('custom-env').env();
const express = require("express");
const logger = require('morgan');
const helmet = require('helmet');
const cron = require('node-cron');
const passport = require('passport');
const velo = require('./velo');
const cors = require('cors');
require('./local-strategy');

//
var indexRouter = require('./controllers/index');
var authRouter = require('./controllers/auth');
var userRouter = require('./controllers/user');
var settingsRouter = require('./controllers/settings');
var payeesRouter = require('./controllers/payees');
var paymentsRouter = require('./controllers/payments');
var reportingRouter = require('./controllers/reporting');

//
var app = express();

app.use(helmet())
app.use(logger('dev'));
app.use(express.json());

app.use(cors({
  origin: function(origin, callback){
    return callback(null, true);
  }
}));
app.use('/', indexRouter);
app.use('/auth', authRouter);
app.use('/user', passport.authenticate('jwt', {session: false}), userRouter);
app.use('/settings', passport.authenticate('jwt', {session: false}), settingsRouter);
app.use('/payees', passport.authenticate('jwt', {session: false}), payeesRouter);
app.use('/payments', passport.authenticate('jwt', {session: false}), paymentsRouter);
app.use('/reporting', passport.authenticate('jwt', {session: false}), reportingRouter);

app.use(function(req, res, next) {
  return res.status(404).json();
});
app.use(function(err, req, res, next) {
  console.log('ERROR:', err);
  return res.status(500).json();
});

//
cron.schedule('* * * * *', () => {
  velo.checkAccessTokenExpiration();
});

app.listen(4567);
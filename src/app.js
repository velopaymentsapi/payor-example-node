//
require('custom-env').env();
const express = require("express");
const createError = require('http-errors');
const logger = require('morgan');
const helmet = require('helmet');
const cron = require('node-cron');
const passport = require('passport');
const velo = require('./velo');
require('./local-strategy');

//
var indexRouter = require('./routes/index');
var authRouter = require('./routes/auth');
var userRouter = require('./routes/user');
var settingsRouter = require('./routes/settings');
var payeesRouter = require('./routes/payees');
var paymentsRouter = require('./routes/payments');
var reportingRouter = require('./routes/reporting');

//
var app = express();

app.use(helmet())
app.use(logger('dev'));
app.use(express.json());

app.use('/', indexRouter);
app.use('/auth', authRouter);
app.use('/user', passport.authenticate('jwt', {session: false}), userRouter);
app.use('/settings', passport.authenticate('jwt', {session: false}), settingsRouter);
app.use('/payees', passport.authenticate('jwt', {session: false}), payeesRouter);
app.use('/payments', passport.authenticate('jwt', {session: false}), paymentsRouter);
app.use('/reporting', passport.authenticate('jwt', {session: false}), reportingRouter);

app.use(function(req, res, next) {
  next(createError(404));
});
app.use(function(err, req, res, next) {
  next(createError(500));
});

//
cron.schedule('* * * * *', () => {
  console.log('running a task every minute');
  velo.checkAccessTokenExpiration();
});

app.listen(4567);
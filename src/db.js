const initOptions = {};
const pgp = require('pg-promise')(initOptions);

const cn = process.env.DB_URI;
const db = pgp(cn);

module.exports = db;
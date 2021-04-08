/* eslint-disable no-console */
const mongoose = require('mongoose');
const { db } = require('../configs');
const models = require('./models');

if (process.env.NODE_ENV !== 'test') {
  mongoose.connect(db.database, db.mongoOptions, (err) => {
    if (err) {
      console.info(`mongodb connection failed ${err}`);
    } else {
      console.info('hello from mongodb');
    }
  });
}

mongoose.connection.on('error', () => {
  console.info('mongodb connection on error');
});

module.exports = () => ({ ...models });

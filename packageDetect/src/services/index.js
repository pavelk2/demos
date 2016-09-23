'use strict';
const predictions = require('./predictions');

module.exports = function() {
  const app = this;


  app.configure(predictions);
};

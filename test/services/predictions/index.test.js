'use strict';

const assert = require('assert');
const app = require('../../../src/app');

describe('predictions service', function() {
  it('registered the predictions service', () => {
    assert.ok(app.service('predictions'));
  });
});

'use strict';

const hooks = require('./hooks');
const request = require('request');

class Service {
  constructor(options) {
    this.predictions = [];
    this.options = options || {};
  }

  find(params) {
    return new Promise((resolve, reject) => {
      request({
        url:"http://simplexagcsvisionapp.azurewebsites.net/api/vision",
        qs: {
          keywords: "box,package",
          imageurl: params.query.url || "http://sonderbooks.com/blog/wp-content/uploads/2011/07/boxes.jpg"
        }
      }, function(error, response, body) {
        if(error){
          reject({error: error})
        } else {
          resolve({result: body})
        }
      })
    })
  }

  get(id, params) {
    return Promise.resolve({
      id, text: `A new message with ID: ${id}!`
    });
  }

  create(data, params) {
    return Promise.resolve([])
  }

  update(id, data, params) {
    return Promise.resolve(data);
  }

  patch(id, data, params) {
    return Promise.resolve(data);
  }

  remove(id, params) {
    return Promise.resolve({ id });
  }
}

module.exports = function(){
  const app = this;

  // Initialize our service with any options it requires
  app.use('/predictions', new Service());

  // Get our initialize service to that we can bind hooks
  const predictionsService = app.service('/predictions');

  // Set up our before hooks
  predictionsService.before(hooks.before);

  // Set up our after hooks
  predictionsService.after(hooks.after);
};

module.exports.Service = Service;

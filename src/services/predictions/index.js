'use strict';

const hooks = require('./hooks');
const request = require('request');

class Service {
  constructor(options) {
    this.results = {};
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
    return Promise.resolve(this.results[id]);
  }

  create(data, params) {
    var result = request.post(`https://api.crowdflower.com/v1/jobs/${process.env.CF_JOB_ID}/units.json?key=${process.env.CF_API_KEY}`).form({
      unit: {
        data: { url: data.url || params.url }
      }
    });
    this.results[result.unit.id] = {state: "pending"};
    return Promise.resolve(result)
  }

  update(id, data, params) {
    var payload = JSON.parse(data.payload)
    this.results[payload.id] = payload;
    return Promise.resolve(payload);
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

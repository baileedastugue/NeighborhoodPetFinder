/* eslint-disable prettier/prettier */
/* eslint-disable indent */
var expect = require("chai").expect;

const request = require('supertest');
const app = require('../server.js');
const API = require('../public/js/indexApiCalls');
var db = require("../models");

// this won't work until mysql in testdb resolved with API.chosenPet call
// describe('test API.chosenPet call to apiRoutes POST /api/chosenPet', function () {
//   it('return status response', function () {
//     return request(API)
//       .call('.chosenPet')
//       .expect(200)
//     // .expect('Content-Type', "text/html; charset=utf-8")
//     // .expect('{}')
//   })
// })


// DON'T USE YET: Referenced in stack-overflow, does not work
// describe('test the MySQL CONNECTION', function () {
//   it('db.connection.connect should ...', function (done) {
//     db.sequelize.connect(function (err, result) {
//       if (err) {
//         done(err);
//         return;
//       }
//       expect(result).to.equal("SQL CONNECT SUCCESSFUL.");
//       done();
//     });
//   });
// });





// test out POST /api/chosenPet route
describe('POST /api/chosenPet', function () {
  it('return json response', function () {
    return request(app)
      .get('/')
      .expect(200)
      .expect('Content-Type', "text/html; charset=utf-8")
    // .expect('{}')
  })
})

describe('GET /login', function () {
  it('return json response', function () {
    return request(app)
      .get('/')
      .expect(200)
      .expect('Content-Type', "text/html; charset=utf-8")
    // .expect('{}')
  })
})



describe("canary test", function () {
  // A "canary" test is one we set up to always pass
  // This can help us ensure our testing suite is set up correctly before writing real tests
  it("should pass this canary test", function () {
    expect(true).to.be.true;
  });
});


// close out server and sequelize connection after one second of tests
setTimeout(function () { process.exit(); }, 1000);


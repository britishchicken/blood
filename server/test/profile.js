'use strict'
let profileControllers = require('../controllers/profile.js');
let db = require('../controllers/controller.js');
let Donor = db.Donor;

let sinon = require('sinon');
let chai = require('chai');
let expect = chai.expect;
let http_mocks = require('node-mocks-http');

function buildResponse() {
  return http_mocks.createResponse({eventEmitter: require('events').EventEmitter})
}

describe('Profile', function() {
  describe('getDonorById', function() {
    it('should get donor by id', function(done) {
      Donor.create({name: 'testname'})
      .then((donor) => {
        let response = buildResponse();
        let request  = http_mocks.createRequest({
          method: 'GET',
          url: '/' + donor.id,
          params: {
            id: donor.id
          }
        });

        response.on('end', function() {
          Donor.destroy({where: {name: 'testname'}});
          expect(response._getData().name).to.equal('testname');
          done();
        });

        profileControllers.getDonorById(request, response);
      });
    });
  });

  describe('getCurrentDonor', function() {
    it('should get current donor', function(done) {
      Donor.create({name: 'testname'})
      .then((donor) => {
        let response = buildResponse();
        let request  = http_mocks.createRequest({
          method: 'GET',
          url: '/'
        });

        request.user = {id: donor.id};

        response.on('end', function() {
          Donor.destroy({where: {name: 'testname'}});
          expect(response._getData().name).to.equal('testname');
          done();
        });

        profileControllers.getCurrentDonor(request, response);
      });
    });
  });

  describe('updateCurrentDonor', function() {
    it('should update current donor', function(done) {
      Donor.create({name: 'testname'})
      .then((donor) => {
        let response = buildResponse();
        let request  = http_mocks.createRequest({
          method: 'PUT',
          url: '/',
          body: {
            name: 'Max Power'
          }
        });

        request.user = {id: donor.id};

        response.on('end', function() {
          Donor.destroy({where: {id: donor.id}});
          expect(response._getData().name).to.equal('Max Power');
          done();
        });

        profileControllers.updateCurrentDonor(request, response);
      });
    });
  });
});

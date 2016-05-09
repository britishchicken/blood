'use strict'
let hospitalControllers = require('../controllers/hospital.js');
let db = require('../controllers/controller.js');
let Hospital = db.Hospital;
let Donor = db.Donor;
let Review = db.Review;

let chai = require('chai');
let expect = chai.expect;
let http_mocks = require('node-mocks-http');

function buildResponse() {
  return http_mocks.createResponse({eventEmitter: require('events').EventEmitter})
}

describe('Hospitals', function() {
  describe('getCurrentHospital', function() {
    it('should find the current hospital', function(done) {
      Hospital.create({name: 'testhospital'})
      .then((hospital) => {
        let response = buildResponse();
        let request  = http_mocks.createRequest({
          method: 'GET',
          url: '/'
        });

        request.user = {id: hospital.id};

        response.on('end', function() {
          Hospital.destroy({where: {id: hospital.id}});
          expect(response._getData().name).to.equal('testhospital');
          done();
        });

        hospitalControllers.getCurrentHospital(request, response);
      });
    });
  });

  describe('updateCurrentHospital', function() {
    it('should update current hospital name', function(done) {
      Hospital.create({name: 'testhospital'})
      .then((hospital) => {
        let response = buildResponse();
        let request  = http_mocks.createRequest({
          method: 'PUT',
          url: '/',
          body: {
            name: 'newhospital'
          }
        });

        request.user = {id: hospital.id};

        response.on('end', function() {
          Hospital.destroy({where: {id: hospital.id}});
          expect(response._getData().name).to.equal('newhospital');
          done();
        });

        hospitalControllers.updateCurrentHospital(request, response);
      });
    });
  });

  describe('getHospitalById', function() {
    it('should get hospital by id', function(done) {
      Hospital.create({name: 'testhospital'})
      .then((hospital) => {
        let response = buildResponse();
        let request  = http_mocks.createRequest({
          method: 'GET',
          url: '/' + hospital.id,
          params: {
            id: hospital.id
          }
        });

        response.on('end', function() {
          Hospital.destroy({where: {id: hospital.id}});
          expect(response._getData().name).to.equal('testhospital');
          done();
        });

        hospitalControllers.getHospitalById(request, response);
      });
    });
  });

  describe('getHospitalsByLocation', function() {
    it('should get hospitals within a location', function(done) {
      Hospital.create({name: 'testhospital', latitude: 100, longitude: 100})
      .then((hospital) => {
        let response = buildResponse();
        let request  = http_mocks.createRequest({
          method: 'GET',
          url: '/geo?minLat=90&maxLat=110&minLong=90&maxLong=110',
        });

        response.on('end', function() {
          Hospital.destroy({where: {id: hospital.id}});
          expect(response._getData().findIndex(entry => entry.id === hospital.id)).to.be.above(-1);
          done();
        });

        hospitalControllers.getHospitalsByLocation(request, response);
      });
    });

    it('should fail to get hospitals outside a location', function(done) {
      Hospital.create({name: 'testhospital', latitude: 100, longitude: 100})
      .then((hospital) => {
        let response = buildResponse();
        let request  = http_mocks.createRequest({
          method: 'GET',
          url: '/geo?minLat=90&maxLat=110&minLong=105&maxLong=110',
        });

        response.on('end', function() {
          Hospital.destroy({where: {id: hospital.id}});
          expect(response._getData().findIndex(entry => entry.id === hospital.id)).to.equal(-1);
          done();
        });

        hospitalControllers.getHospitalsByLocation(request, response);
      });
    });
  });

  describe('getHospitalReviews', function() {
    it('should get reviews of a hospital', function(done) {
      Hospital.create({name: 'testhospital', latitude: 100, longitude: 100})
      .then((hospital) => {
        Review.create({content: 'test content', hospitalId: hospital.id})
        .then(review => {
          let response = buildResponse();
          let request  = http_mocks.createRequest({
            method: 'GET',
            url: `/${hospital.id}/reviews`,
            params: {
              id: hospital.id
            }
          });

          response.on('end', function() {
            Review.destroy({where: {id: review.id}});
            Hospital.destroy({where: {id: hospital.id}});
            expect(response._getData().length).to.equal(1);
            done();
          });

          hospitalControllers.getHospitalReviews(request, response);
        });
      });
    });
  });

  describe('postHospitalReview', function() {
    it('should post reviews of a hospital', function(done) {
      Promise.all([
        Hospital.create({name: 'testhospital', latitude: 100, longitude: 100}),
        Donor.create({name: 'test'})
        ])
      .then(results => {
        let hospital = results[0];
        let donor = results[1];

        let response = buildResponse();
        let request  = http_mocks.createRequest({
          method: 'POST',
          url: `/${hospital.id}/reviews`,
          params: {
            id: hospital.id
          },
          body: {
            content: 'test',
            stars: 3
          }
        });

        request.user = {id: donor.id};

        response.on('end', function() {
          Review.findAll({where: {hospitalId: hospital.id}})
          .then(reviews => {
            expect(reviews.length).to.equal(1);
            // Review.destroy({where: {hospitalId: hospital.id}});
            // Hospital.destroy({where: {id: hospital.id}});
            // Donor.destroy({where: {id: donor.id}});
            done();
          });
        });

        hospitalControllers.postHospitalReview(request, response);
      });
    });
  });
});

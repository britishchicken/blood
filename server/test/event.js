'use strict'
let eventControllers = require('../controllers/event.js');
let db = require('../controllers/controller.js');
let Event = db.Event;
let Donor = db.Donor;
let Hospital = db.Hospital;

let chai = require('chai');
let expect = chai.expect;
let http_mocks = require('node-mocks-http');

function buildResponse() {
  return http_mocks.createResponse({eventEmitter: require('events').EventEmitter})
}

describe('Events', function() {
  describe('postEvent', function() {
    let testDonor;

    before(function(done) {
      Donor.create({name: 'testdonor'})
      .then(donor => {
        testDonor = donor;
        console.log('finshed creating donor');
        done();
      });
    });

    it('should post an event', function(done) {
      let response = buildResponse();
      let request  = http_mocks.createRequest({
        method: 'POST',
        url: '/',
        body: {
          time: new Date().toUTCString()
        }
      });

      request.user = {id: testDonor.id};

      response.on('end', function() {
        console.log('response ended');
        Event.destroy({where: {id: response._getData().id}});
        console.log('response: ', response._getData().id);
        expect(response._getData().id).to.be.above(0);
        done();
      });
      console.log('sending request');
      eventControllers.postEvent(request, response);
    });

    after(function() {
      Donor.destroy({where: {name: 'testdonor'}});
    });
  });

  describe('getting events', function() {
    let testHospital;
    let testEvent;

    beforeEach(function(done) {
      Hospital.create({longitude: 100, latitude: 100})
      .then(hospital => {
        testHospital = hospital;
        Event.create({hospitalId: hospital.id, time: new Date('2016-06-01 12:00').toISOString().slice(0, 19).replace('T', ' ')})
        .then(event => {
          testEvent = event;
          done();
        });
      });
    });

    describe('getEventById', function() {
      it('should get event by id', function(done) {
        let response = buildResponse();
        let request  = http_mocks.createRequest({
          method: 'GET',
          url: '/' + testEvent.id,
          params: {
            id: testEvent.id
          }
        });

        response.on('end', function() {
          expect(response._getData().id).to.equal(testEvent.id);
          done();
        });

        eventControllers.getEventById(request, response);
      });
    });

    describe('getEventsByLocation', function() {
      it('should get events in a location', function(done) {
        let response = buildResponse();
        let request  = http_mocks.createRequest({
          method: 'GET',
          url: '/geo?minLat=90&maxLat=110&minLong=90&maxLong=110'
        });

        response.on('end', function() {
          expect(response._getData().findIndex(entry => entry.id === testEvent.id)).to.be.above(-1);
          done();
        });

        eventControllers.getEventsByLocation(request, response);
      });

      it('should not get events outside a location', function(done) {
        let response = buildResponse();
        let request  = http_mocks.createRequest({
          method: 'GET',
          url: '/geo?minLat=90&maxLat=110&minLong=101&maxLong=110'
        });

        response.on('end', function() {
          expect(response._getData().findIndex(entry => entry.id === testEvent.id)).to.equal(-1);
          done();
        });

        eventControllers.getEventsByLocation(request, response);
      });
    });

    afterEach(function(done) {
      Event.destroy({where: {id: testEvent.id}})
      .then(() => {
        return Hospital.destroy({where: {id: testHospital.id}});
      })
      .then(done(null));
    });
  });

  describe('joinEvent', function() {
    let testEvent;
    let testDonor;

    before(function(done) {
      Promise.all([
        Event.create({time: new Date('2016-06-01 12:00').toISOString().slice(0, 19).replace('T', ' ')}),
        Donor.create()
        ]).then(results => {
          testEvent = results[0];
          testDonor = results[1];
          done();
        });
    });

    it('should add donor to event', function(done) {
      let response = buildResponse();
        let request  = http_mocks.createRequest({
          method: 'POST',
          url: '/' + testEvent.id,
          params: {
            id: testEvent.id
          }
        });

        request.user = {id: testDonor.id};

        response.on('end', function() {
          expect(response.statusCode).to.equal(200);
          done();
        });

        eventControllers.joinEvent(request, response);
    });

    after(function() {
      Event.destroy({where: {id: testEvent.id}});
      Donor.destroy({where: {id: testDonor.id}});
    });
  });
});

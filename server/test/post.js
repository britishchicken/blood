'use strict'
let postControllers = require('../controllers/post.js');
let db = require('../controllers/controller.js');
let Post = db.Post;

let chai = require('chai');
let expect = chai.expect;
let http_mocks = require('node-mocks-http');

function buildResponse() {
  return http_mocks.createResponse({eventEmitter: require('events').EventEmitter})
}

describe('Posts', function() {
  describe('getPostsByLocation', function() {
    let testPost;
    before(function(done) {
      Post.create({content: 'test', longitude: 100, latitude: 100})
      .then(post => {
        testPost = post;
        done();
      });
    });

    it('should get posts within a location', function(done) {
      let response = buildResponse();
      let request  = http_mocks.createRequest({
        method: 'GET',
        url: '/?minLat=90&maxLat=110&minLong=90&maxLong=110'
      });

      response.on('end', function() {
        expect(response._getData().findIndex(entry => entry.id === testPost.id)).to.be.above(-1);
        done();
      });

      postControllers.getPostsByLocation(request, response);
    });

    it('should not get posts outside a location', function(done) {
      let response = buildResponse();
      let request  = http_mocks.createRequest({
        method: 'GET',
        url: '/?minLat=105&maxLat=110&minLong=90&maxLong=110'
      });

      response.on('end', function() {
        expect(response._getData().findIndex(entry => entry.id === testPost.id)).to.equal(-1);
        done();
      });

      postControllers.getPostsByLocation(request, response);
    });

    after(function() {
      Post.destroy({where: {id: testPost.id}});
    });
  });

  describe('postPost', function() {
    it('should post a post', function(done) {
      let response = buildResponse();
      let request  = http_mocks.createRequest({
        method: 'POST',
        url: '/',
        body: {
          content: 'test',
          location: {
            latitude: 100,
            longitude: 100
          }
        }
      });

      request.user = {type: 'n/a'};

      response.on('end', function() {
        Post.destroy({where: {id: response._getData().id}});
        expect(response._getData().content).to.equal('test');
        done();
      });

      postControllers.postPost(request, response);
    });
  });
});

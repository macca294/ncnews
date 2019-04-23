process.env.NODE_ENV = 'test';
const {
  expect
} = require('chai');
const supertest = require('supertest');

const app = require('../app');
const connection = require('../db/connection');
const request = supertest(app);

beforeEach(() => connection.seed.run());
after(() => connection.destroy());

describe.only('/', () => {
  describe('/api', () => {
    it('GET status:200', () => {
      return request
        .get('/api')
        .expect(200)
        .then(({
          body
        }) => {
          expect(body.ok).to.equal(true);
        });
    });
  });
  describe('/api/topics', () => {
    it('GET status:200,  returns an array of topic objects containing slug and description ', () => {
      return request
        .get("/api/topics")
        .expect(200)
        .then(({
          body
        }) => {
          expect(body.topics.length).to.equal(3);
          expect(body.topics).to.be.an('array');
          expect(body.topics[0].slug).to.be.a('string');
        });
    });

  });
  describe('/api/articles', () => {
    it('GET status:200,  returns array of article objects ', () => {
      return request
        .get("/api/articles")
        .expect(200)
        .then(({
          body
        }) => {
          expect(body.articles.length).to.equal(12)
        });
    });

  });
});
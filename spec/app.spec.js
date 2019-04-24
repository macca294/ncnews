process.env.NODE_ENV = 'test';
const {
  expect,
  use
} = require('chai');
const supertest = require('supertest');
const chaiSorted = require("chai-sorted");
const app = require('../app');
const connection = require('../db/connection');
const request = supertest(app);

use(chaiSorted);


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
          expect(body.topics[0]).to.eql({
            slug: 'mitch',
            description: 'The man, the Mitch, the legend'
          });
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
          expect(body.articles[6].topic).to.eql('mitch')
        });
    });
    it('response includes a comment count total', () => {
      return request
        .get("/api/articles")
        .expect(200)
        .then(({
          body
        }) => {
          expect(body.articles[0].comment_count).to.eql('13')
          expect(body.articles[11].comment_count).to.eql('0')
        });
    });
    it('accepts an author query that filters articles by username', () => {
      return request
        .get("/api/articles?author=butter_bridge")
        .expect(200)
        .then(({
          body
        }) => {
          expect(body.articles.length).to.eql(3);
          expect(body.articles.every(article => article.author === 'butter_bridge')).to.equal(true);
        });
    });
    it('accepts a topic query that filters articles by topic', () => {
      return request
        .get("/api/articles?topic=mitch")
        .expect(200)
        .then(({
          body
        }) => {
          expect(body.articles.length).to.eql(11);
          expect(body.articles.every(article => article.topic === 'mitch')).to.equal(true);
        });
    });
    it('sort_by query sorts the articles by any valid column', () => {
      return request
        .get("/api/articles?sort_by=topic")
        .expect(200)
        .then(({
          body
        }) => {
          expect(body.articles).to.be.sortedBy("topic", {
            descending: true
          });
        });
    });
    it('sort_by defaults to date', () => {
      return request
        .get("/api/articles")
        .expect(200)
        .then(({
          body
        }) => {
          expect(body.articles[body.articles.length - 1].title).to.eql('Moustache');
          expect(body.articles[0].title).to.eql('Living in the shadow of a great man');
        });
    });
    it('order query is defaulted to desc', () => {
      return request
        .get("/api/articles?order=desc")
        .expect(200)
        .then(({
          body
        }) => {
          expect(body.articles[body.articles.length - 1].title).to.eql('Moustache');
          expect(body.articles[0].title).to.eql('Living in the shadow of a great man');
        });
    });
    it('order can be set to asc or desc for ascending or descending', () => {
      return request
        .get("/api/articles?order=asc")
        .expect(200)
        .then(({
          body
        }) => {
          expect(body.articles[0].title).to.eql('Moustache');
          expect(body.articles[body.articles.length - 1].title).to.eql('Living in the shadow of a great man');
        });
    });
    describe('/api/articles/:id', () => {
      it('GET status:200,  returns array of article objects for specified user', () => {
        return request
          .get("/api/articles/2")
          .expect(200)
      });
    });
    describe('/articles errors', () => {
      it('404: article not found when given a non-existant author query', () => {
        return request
          .get("/api/articles?author=banana")
          .expect(404)
          .then(res => {
            expect(res.body.msg).that.equal('Article not found')
          })
      });
    });
  });
});
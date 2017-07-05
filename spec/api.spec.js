process.env.NODE_ENV = 'test';
const { expect } = require('chai');
const request = require('supertest');
const server = require('../server');
const saveTestData = require('../seed/test.seed');
const config = require('../config');
var mongoose = require('mongoose');
const db = config.DB[process.env.NODE_ENV] || process.env.DB;
// console.log('******', db);

describe('API', function () {
  let usefulIds;
  before((done) => {
    mongoose.connection.dropDatabase()
      .then(() => saveTestData(db, function (err, ids) {
        if (err) throw err;
        usefulIds = ids;
        done();
      }));
  });
  describe('GET /', function () {
    it('responds with status code 200', function (done) {
      request(server)
        .get('/')
        .end((err, res) => {
          if (err) done(err);
          else {
            expect(res.status).to.equal(200);
            done();
          }
        });
    });
  });
  describe('GET /topics', function () {
    it('responds with all topics', function (done) {

      request(server)
        .get('/api/topics')
        .end((err, res) => {
          if (err) return console.log(err);
          expect(res.status).to.equal(200);
          expect(res.body.topics.length).to.equal(3);
          done();

        });
    });
  });
  describe('GET /api/topics/:topic_id/articles', function () {
    it('should return all of the articles that match the requested topic', function (done) {

      request(server)
        .get('/api/topics/football/articles')
        .end((err, res) => {
          if (err) return console.log(err);
          expect(res.status).to.equal(200);
          expect(res.body.articlesByTopic.length).to.equal(1);
          done();
        });
    });
    it('should return an error if the topic does not exist', function (done) {

      request(server)
        .get('/api/topics/coconuts/articles')
        .end((err, res) => {
          if (err) return console.log(err);
          expect(res.status).to.equal(404);
          expect(res.body.message).to.equal('Topic not found');
          done();
        });
    });
  });
  describe('GET /articles', function () {
    it('responds with all articles', function (done) {

      request(server)
        .get('/api/articles')
        .end((err, res) => {
          if (err) return console.log(err);
          expect(res.status).to.equal(200);
          expect(res.body.articles.length).to.equal(2);
          done();

        });
    });

  });
  describe('GET /api/articles/:article_id/comments', function () {
    it('should return all of the comments that match the requested article', function (done) {
      let idForArticle = usefulIds.article_id;
      // console.log(idForArticle)
      request(server)
        .get(`/api/articles/${idForArticle}/comments`)
        .end((err, res) => {
          if (err) return console.log(err);
          expect(res.status).to.equal(200);
          expect(res.body.commentsForArticles.length).to.equal(2);
          done();
        });
    });
    it('should return an error if the article does not exist', function (done) {

      request(server)
        .get('/api/articles/594cf85ab75d862c4fbffa09/comments')
        .end((err, res) => {
          if (err) return console.log(err);
          expect(res.status).to.equal(404);
          expect(res.body.message).to.equal('Articles not found');
          done();
        });
    });
  });
  describe('PUT /api/articles/:article_id', function() {
        it('increments the votes of an article by 1', function(done) {
          console.log(usefulIds);
            // console.log('votes: ' + usefulIds.articles[0].votes);
            let articleId = usefulIds.article_id;
            request(server)
                .put(`/api/articles/${articleId}?vote=up`)
                .end((err, res) => {
                    if (err) return done(err);
                    expect(res.status).to.equal(200);
                    expect(res.body.article.votes).to.equal(1);
                    done();
                });
        });
        it('decrements the votes of an article by 1', function(done) {
          console.log(usefulIds);
            // console.log('votes: ' + usefulIds.articles[0].votes);
            let articleId = usefulIds.article_id;
            request(server)
                .put(`/api/articles/${articleId}?vote=down`)
                .end((err, res) => {
                    if (err) return done(err);
                    expect(res.status).to.equal(200);
                    expect(res.body.article.votes).to.equal(0);
                    done();
                });
        });
    });
});
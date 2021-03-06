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

describe('/', () => {
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
    describe('/api/articles/:article_id', () => {
      it('GET status:200,  returns article objects for specified user', () => {
        return request
          .get("/api/articles/12")
          .expect(200)
          .then(({

            body
          }) => {
            expect(body.article).to.eql({
              article_id: 12,
              title: 'Moustache',
              body: 'Have you seen the size of that thing?',
              comment_count: "0",
              votes: 0,
              topic: 'mitch',
              author: 'butter_bridge',
              created_at: '1974-11-26T12:21:54.171Z'
            });
          });
      });
      it('PATCH status:200, allows update of article votes', () => {
        return request
          .patch("/api/articles/12")
          .send({
            inc_votes: 1
          })
          .expect(200)
          .then(({
              body
            }) =>
            expect(body.article).to.eql({
              article_id: 12,
              title: 'Moustache',
              body: 'Have you seen the size of that thing?',
              votes: 1,
              topic: 'mitch',
              author: 'butter_bridge',
              created_at: '1974-11-26T12:21:54.171Z'
            }))
          .then(() => {
            return request
              .patch("/api/articles/12")
              .send({
                inc_votes: -1
              })
              .expect(200)
              .then(({
                  body
                }) =>
                expect(body.article).to.eql({
                  article_id: 12,
                  title: 'Moustache',
                  body: 'Have you seen the size of that thing?',
                  votes: 0,
                  topic: 'mitch',
                  author: 'butter_bridge',
                  created_at: '1974-11-26T12:21:54.171Z'
                }))
          })
      });
    });
    describe('/api/articles', () => {
      it('POST status:200, allows post of new article', () => {
        return request
          .post("/api/articles")
          .send({
            title: 'test',
            topic: 'mitch',
            username: 'butter_bridge',
            body: 'test article'
          })
          .expect(200)
          .then((({
            body
          }) => {
            expect(body.article).to.include({
              title: 'test',
              topic: 'mitch',
              author: 'butter_bridge',
              votes: 0,
              body: 'test article',
              article_id: 13
            })
          }))
      });
    });

    describe('/api/articles/:article_id/comments', () => {
      it('GET status:200, responds with array of comments for given article_id ', () => {
        return request
          .get("/api/articles/5/comments")
          .expect(200)
          .then(({
            body
          }) => {
            expect(body.comments).to.eql(
              [{
                  comment_id: 14,
                  author: 'icellusedkars',
                  article_id: 5,
                  votes: 16,
                  created_at: '2004-11-25T12:36:03.389Z',
                  body: 'What do you see? I have no idea where this will lead us. This place I speak of, is known as the Black Lodge.'
                }, {
                  comment_id: 15,
                  author: 'butter_bridge',
                  article_id: 5,
                  votes: 1,
                  created_at: '2003-11-26T12:36:03.389Z',
                  body: "I am 100% sure that we're not completely sure."
                }

              ]
            )
          })
      });
      it('GET status:200, allows sort_by query defaulting to created_at', () => {
        return request
          .get("/api/articles/5/comments?sort_by=author")
          .expect(200)
          .then(({
            body
          }) => {
            expect(body.comments).to.eql(
              [{
                comment_id: 14,
                author: 'icellusedkars',
                article_id: 5,
                votes: 16,
                created_at: '2004-11-25T12:36:03.389Z',
                body: 'What do you see? I have no idea where this will lead us. This place I speak of, is known as the Black Lodge.'
              }, {
                comment_id: 15,
                author: 'butter_bridge',
                article_id: 5,
                votes: 1,
                created_at: '2003-11-26T12:36:03.389Z',
                body: "I am 100% sure that we're not completely sure."
              }]
            )
          })
      })
      it('GET status:200, allows order_by query defaulting to desc', () => {
        return request
          .get("/api/articles/5/comments?sort_by=author")
          .expect(200)
          .then(({
            body
          }) => {
            expect(body.comments).to.eql(
              [{
                comment_id: 14,
                author: 'icellusedkars',
                article_id: 5,
                votes: 16,
                created_at: '2004-11-25T12:36:03.389Z',
                body: 'What do you see? I have no idea where this will lead us. This place I speak of, is known as the Black Lodge.'
              }, {
                comment_id: 15,
                author: 'butter_bridge',
                article_id: 5,
                votes: 1,
                created_at: '2003-11-26T12:36:03.389Z',
                body: "I am 100% sure that we're not completely sure."
              }]
            )
          }).then(() => {
            return request
              .get("/api/articles/5/comments?sort_by=votes&order=asc")
              .expect(200)
              .then(({
                body
              }) => {
                expect(body.comments).to.eql(
                  [{
                    comment_id: 15,
                    author: 'butter_bridge',
                    article_id: 5,
                    votes: 1,
                    created_at: '2003-11-26T12:36:03.389Z',
                    body: "I am 100% sure that we're not completely sure."
                  }, {
                    comment_id: 14,
                    author: 'icellusedkars',
                    article_id: 5,
                    votes: 16,
                    created_at: '2004-11-25T12:36:03.389Z',
                    body: 'What do you see? I have no idea where this will lead us. This place I speak of, is known as the Black Lodge.'
                  }]
                )
              })
          });

      });
      it('POST Status:201,  allows for a new comment to be added, by article_id', () => {
        return request
          .post("/api/articles/5/comments")
          .send({
            username: 'butter_bridge',
            body: 'test comment...'
          })
          .expect(201)
          .then(({
            body
          }) => {
            expect(body.comment.author).to.eql('butter_bridge')
            expect(body.comment.body).to.eql('test comment...')
            expect(body.comment.article_id).to.eql(5)
          })
      })
    });
  });
  describe('/articles errors', () => {
    it('404: article not found when given a non-existant author query', () => {
      return request
        .get("/api/articles?author=banana")
        .expect(404)
        .then(res => {
          expect(res.body.msg).that.equal('Not Found')
        })
    });
    it('400 - BAD REQUEST: Responds with status 400 when given an invalid column to sort_by', () => {
      return request.get('/api/articles?sort_by=ban_a_na').expect(400).then(({
        body
      }) => {
        expect(body.msg).to.equal('Bad Query')
      })
    });
    it('200 - Responds with status 200 and defaults to "desc" when given an invalid order input', () => {
      return request.get('/api/articles?order=banana').expect(200).then(({
        body
      }) => {
        expect(body.articles).to.be.sortedBy('created_at', {
          descending: true
        })
      })
    });
    it('400 - BAD REQUEST: Responds with status 400 when given an invalid article Id', () => {
      return request.get('/api/articles/banana').expect(400).then(({
        body
      }) => {
        expect(body.msg).to.equal('Bad Request')
      })
    });
    it('404 - article_id not found: Response when given article Id number that doesnt exist', () => {
      return request.get('/api/articles/99999').expect(404).then(({
        body
      }) => {
        expect(body.msg).to.equal('Not Found')
      })
    });
    it('400 - PATCH - BAD REQUEST: Responds with status 400 when patch request has an invalid inc_votes', () => {
      return request
        .patch('/api/articles/5')
        .send({
          inc_votes: 'abc'
        })
        .expect(400).then(({
          body
        }) => {
          expect(body.msg).to.equal('Bad Request')
        })
    });
    it('200 - PATCH - : Responds with unaffected object when request body empty setting inc_votes to 0', () => {
      return request
        .patch('/api/articles/5')
        .send({})
        .expect(200)
        .then(({
          body
        }) => {
          expect(body).to.eql({
            article: {
              article_id: 5,
              title: 'UNCOVERED: catspiracy to bring down democracy',
              body: 'Bastet walks amongst us, and the cats are taking arms!',
              votes: 0,
              topic: 'cats',
              author: 'rogersop',
              created_at: '2002-11-19T12:21:54.171Z'
            }
          })
        })
    });
  });
  it('404 - Not Found - responds with not found when looking for comments on article ID that doesnt exist ', () => {
    return request
      .get('/api/articles/1000/comments')
      .expect(404)
      .then(({
        body
      }) => {
        expect(body.msg).to.equal('Not Found')
      })
  });
  it('400 -  Responds with status 400 when given an invalid column to sort_by', () => {
    return request.get('/api/articles/5/comments?sort_by=ap_pl_e')
      .expect(400)
      .then(({
        body
      }) => {
        expect(body.msg).to.equal('Bad Query')
      })

  });
  it('400 - Bad request - POST - responds 400 if comment doesnt include correct keys', () => {
    return request
      .post('/api/articles/1/comments')
      .send({
        'abc': 'def'
      })
      .expect(400)
      .then(({
        body
      }) => {
        expect(body.msg).to.eql('Bad Request')
      })
  });
  it('404 - user not found - POST - response if comment post doesnt include a known username', () => {
    return request
      .post('/api/articles/1/comments')
      .send({
        'username': 'def',
        'body': 'abc'
      })
      .expect(404)
      .then(({
        body
      }) => {
        expect(body.msg).to.eql('Not Found')
      })

  });

  describe('/comments/:comment_id ', () => {
    it('PATCH status:200 - allows votes update on comment_id', () => {
      return request
        .patch("/api/comments/5")
        .send({
          inc_votes: 1
        })
        .expect(200)
        .then(({
          body
        }) => {
          expect(body.comment).to.eql({
            comment_id: 5,
            author: 'icellusedkars',
            article_id: 1,
            votes: 1,
            created_at: '2013-11-23T12:36:03.389Z',
            body: 'I hate streaming noses'
          })
        }).then(() => {
          return request
            .patch("/api/comments/5")
            .send({
              inc_votes: -1
            })
            .expect(200)
            .then(({
              body
            }) => {
              expect(body.comment).to.eql({
                comment_id: 5,
                author: 'icellusedkars',
                article_id: 1,
                votes: 0,
                created_at: '2013-11-23T12:36:03.389Z',
                body: 'I hate streaming noses'
              })

            })
        })
    });
    it('DELETE status:204 - allows comment to be removed ', () => {
      return request
        .delete("/api/comments/5")
        .expect(204)
        .then(({
          body
        }) => {
          expect(body).to.eql({})
        })
    });
  });

  describe('/api/users/:username', () => {
    it('GET status:200 - responds with user info for given username', () => {
      return request
        .get("/api/users/icellusedkars")
        .expect(200)
        .then(({
          body
        }) => {
          expect(body.user).to.eql({
            username: 'icellusedkars',
            avatar_url: 'https://avatars2.githubusercontent.com/u/24604688?s=460&v=4',
            name: 'sam'
          })
        })
    });
  });
  describe('/comments errors', () => {
    it('200 - PATCH -  responds with unchanged object when empty body sent', () => {
      return request
        .patch("/api/comments/1")
        .send({})
        .expect(200)
        .then(({
          body
        }) => {
          expect(body.comment.votes).to.eql(16)
        })
    });
    it('404 - PATCH -  responds Not Found if valid comment_id but doesnt exist', () => {
      return request
        .patch("/api/comments/1000")
        .send({
          inc_votes: 1
        })
        .expect(404)
        .then(({
          body
        }) => {
          expect(body.msg).to.eql('Not Found')
        })

    });
    it('404 - DELETE -  responds Not Found if valid comment_id but doesnt exist', () => {
      return request
        .delete("/api/comments/1000")
        .expect(404)
        .then(({
          body
        }) => {
          expect(body.msg).to.eql('Not Found')
        })
    });
    it('400 - DELETE -  responds Bad Request if invalid comment_id', () => {
      return request
        .delete("/api/comments/a_b_c")
        .expect(400)
        .then(({
          body
        }) => {
          expect(body.msg).to.eql('Bad Request')
        })
    });
    it('400 - PATCH - responds Bad Request if not a valid Id ', () => {
      return request
        .patch("/api/comments/a_b_c")
        .send({
          inc_votes: 1
        })
        .expect(400)
        .then(({
          body
        }) => {
          expect(body.msg).to.eql('Bad Request')
        })
    });
    it('400 - PATCH - responds Bad Request if not a valid inc_votes value ', () => {
      return request
        .patch("/api/comments/1")
        .send({
          inc_votes: "a"
        })
        .expect(400)
        .then(({
          body
        }) => {
          expect(body.msg).to.eql('Bad Request')
        })
    });
    it('404 - GET - /users - responds Not Found if user doesnt exist', () => {
      return request
        .get("/api/users/a_b_c")
        .expect(404)
        .then(({
          body
        }) => {
          expect(body.msg).to.eql('Not Found')
        })
    });
  });
});
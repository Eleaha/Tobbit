const app = require('../app');
const request = require('supertest');
const db = require('../db/connection');
const seed = require('../db/seeds/seed');
const data = require('../db/data/test-data/index');
const endpoints = require('../endpoints');

afterAll(() => {
	db.end();
});

beforeEach(() => {
	return seed(data);
});

describe('general errors', () => {
	test("ANY 404: returns a 404 error when given a path that doesn't exist", () => {
		return request(app)
			.get('/api/garbage')
			.expect(404)
			.then(({ body }) => {
				expect(body.msg).toBe('Not found');
			});
	});
});

describe('/api/topics', () => {
	test('GET 200: returns all of the topics', () => {
		return request(app)
			.get('/api/topics')
			.expect(200)
			.then(({ body }) => {
				const { topics } = body;
				expect(topics.length).toBe(3);
				topics.forEach((topic) => {
					expect(typeof topic.description).toBe('string');
					expect(typeof topic.slug).toBe('string');
				});
			});
	});
});

describe('/api', () => {
	test('GET 200: returns the same information in the endpoints json to the client', () => {
		return request(app)
			.get('/api')
			.expect(200)
			.then(({ body }) => {
				expect(body.endpoints).toEqual(endpoints);
			});
	});
});

describe('/api/articles/:article_id', () => {
	describe('GET /api/articles/:article_id', () => {
		test('GET 200: Responds with the article that corresponds with the given article id', () => {
			return request(app)
				.get('/api/articles/2')
				.expect(200)
				.then(({ body }) => {
					const { article } = body;
					expect(article.article_id).toEqual(2);
					expect(article.title).toEqual('Sony Vaio; or, The Laptop');
					expect(article.topic).toEqual('mitch');
					expect(article.author).toEqual('icellusedkars');
					expect(article.body).toEqual(
						'Call me Mitchell. Some years ago—never mind how long precisely—having little or no money in my purse, and nothing particular to interest me on shore, I thought I would buy a laptop about a little and see the codey part of the world. It is a way I have of driving off the spleen and regulating the circulation. Whenever I find myself growing grim about the mouth; whenever it is a damp, drizzly November in my soul; whenever I find myself involuntarily pausing before coffin warehouses, and bringing up the rear of every funeral I meet; and especially whenever my hypos get such an upper hand of me, that it requires a strong moral principle to prevent me from deliberately stepping into the street, and methodically knocking people’s hats off—then, I account it high time to get to coding as soon as I can. This is my substitute for pistol and ball. With a philosophical flourish Cato throws himself upon his sword; I quietly take to the laptop. There is nothing surprising in this. If they but knew it, almost all men in their degree, some time or other, cherish very nearly the same feelings towards the the Vaio with me.'
					);
					expect(typeof article.created_at).toEqual('string');
					expect(article.article_img_url).toEqual(
						'https://images.pexels.com/photos/158651/news-newsletter-newspaper-information-158651.jpeg?w=700&h=700'
					);
				});
		});
		test('GET 404: responds with a 404 error when valid but non-existent id is given', () => {
			return request(app)
				.get('/api/articles/500')
				.expect(404)
				.then(({ body }) => {
					expect(body.msg).toEqual('Article not found');
				});
		});
		test('GET 400: responds with a 400 error when an invalid id is given', () => {
			return request(app)
				.get('/api/articles/garbage')
				.expect(400)
				.then(({ body }) => {
					expect(body.msg).toEqual('Bad request');
				});
		});
	});

	describe('PATCH /api/articles/:article_id', () => {
		test('PATCH 200: updates and returns the votes fot eh article with the corresponding id', () => {
			const votes = { inc_votes: 50 };
			return request(app)
				.patch('/api/articles/3')
				.send(votes)
				.expect(200)
				.then(({ body }) => {
					const { article } = body;
					expect(article).toMatchObject({
						article_id: 3,
						title: 'Eight pug gifs that remind me of mitch',
						topic: 'mitch',
						author: 'icellusedkars',
						body: 'some gifs',
						created_at: expect.any(String),
						article_img_url:
							'https://images.pexels.com/photos/158651/news-newsletter-newspaper-information-158651.jpeg?w=700&h=700',
						votes: 50,
					});
				});
		});
		test('PATCH 400: responds with a 400 error if passed data in the wrong format', () => {
			const votes = { garbageVotes: 50 };
			return request(app)
				.patch('/api/articles/3')
				.send(votes)
				.expect(400)
				.then(({ body }) => {
					expect(body.msg).toBe('Invalid input format');
				});
		});
		//Could this also be/would be better off as a 422?
		test('PATCH 400: responds with a 400 error if passed invalid data', () => {
			const votes = { inc_votes: 'sixty' };
			return request(app)
				.patch('/api/articles/3')
				.send(votes)
				.expect(400)
				.then(({ body }) => {
					expect(body.msg).toBe('Bad request');
				});
		});
		test('PATCH 404: responds with a 404 error if given a valid but non-existent article id', () => {
			const votes = { inc_votes: 100 };
			return request(app)
				.patch('/api/articles/100')
				.send(votes)
				.expect(404)
				.then(({ body }) => {
					expect(body.msg).toBe('Article not found');
				});
		});
		test('PATCH 400: responds with a 400 error if given an invalid article id', () => {
			const votes = { inc_votes: 100 };
			return request(app)
				.patch('/api/articles/garbage')
				.send(votes)
				.expect(400)
				.then(({ body }) => {
					expect(body.msg).toBe('Bad request');
				});
		});
	});
});

describe('/api/articles', () => {
	describe('GET /api/articles', () => {
		test('GET 200: responds with an array of all articles without the body property and with a comment count', () => {
			return request(app)
				.get('/api/articles')
				.expect(200)
				.then(({ body }) => {
					const { articles } = body;

					expect(articles.length).toBe(13);
					articles.forEach((article) => {
						expect(article).toMatchObject({
							author: expect.any(String),
							title: expect.any(String),
							article_id: expect.any(Number),
							topic: expect.any(String),
							created_at: expect.any(String),
							article_img_url: expect.any(String),
							votes: expect.any(Number),
							comment_count: expect.any(Number),
						});
					});
				});
		});
		test('GET 200: responds with articles sorted by date in descending order as a default', () => {
			return request(app)
				.get('/api/articles')
				.expect(200)
				.then(({ body }) => {
					const { articles } = body;
					expect(articles).toBeSortedBy('created_at', { descending: true });
				});
		});
	});
});

describe('/api/articles/:article_id/comments', () => {
	describe('GET /api/articles/:article_id/comments', () => {
		test('GET 200: responds with an array of comments with the associated article id', () => {
			return request(app)
				.get('/api/articles/3/comments')
				.expect(200)
				.then(({ body }) => {
					const { comments } = body;
					expect(comments).toEqual([
						{
							comment_id: 11,
							body: 'Ambidextrous marsupial',
							article_id: 3,
							author: 'icellusedkars',
							votes: 0,
							created_at: expect.any(String),
						},
						{
							comment_id: 10,
							body: 'git push origin master',
							article_id: 3,
							author: 'icellusedkars',
							votes: 0,
							created_at: expect.any(String),
						},
					]);
				});
		});

		test('GET 200: responds with an array of comments ordered by created_at in descending order', () => {
			return request(app)
				.get('/api/articles/1/comments')
				.expect(200)
				.then(({ body }) => {
					const { comments } = body;
					expect(comments).toBeSortedBy('created_at', { descending: true });
				});
		});

		test('GET 200: responds with an empty array when an existing article has no comments', () => {
			return request(app)
				.get('/api/articles/2/comments')
				.expect(200)
				.then(({ body }) => {
					expect(body).toEqual({ comments: [] });
				});
		});

		test('GET 404: responds with a 404 error if given a valid but non-existent id', () => {
			return request(app)
				.get('/api/articles/180/comments')
				.expect(404)
				.then(({ body }) => {
					expect(body.msg).toEqual('Article not found');
				});
		});

		test('GET 400: responds with a 400 error if invalid article id is given', () => {
			return request(app)
				.get('/api/articles/garbage/comments')
				.expect(400)
				.then(({ body }) => {
					expect(body.msg).toEqual('Bad request');
				});
		});
	});

	describe('POST /api/articles/:article_id/comments', () => {
		test('POST 201: posts a new comment and returns the comment with an id', () => {
			const comment = {
				username: 'butter_bridge',
				body: 'Wow I totally agree!',
			};
			return request(app)
				.post('/api/articles/3/comments')
				.send(comment)
				.expect(201)
				.then(({ body }) => {
					expect(body.comment).toEqual({
						comment_id: 19,
						author: 'butter_bridge',
						body: 'Wow I totally agree!',
						article_id: 3,
						votes: 0,
						created_at: expect.any(String),
					});
				});
		});
		test('POST 404: throws a 404 error when given a valid but non-existent article id', () => {
			const comment = {
				username: 'butter_bridge',
				body: 'Wow I totally agree!',
			};
			return request(app)
				.post('/api/articles/101/comments')
				.send(comment)
				.expect(404)
				.then(({ body }) => {
					expect(body.msg).toEqual('Article not found');
				});
		});
		test('POST 400: throws a 400 error when given an invalid article id', () => {
			const comment = {
				username: 'butter_bridge',
				body: 'Wow I totally agree!',
			};
			return request(app)
				.post('/api/articles/garbage/comments')
				.send(comment)
				.expect(400)
				.then(({ body }) => {
					expect(body.msg).toEqual('Bad request');
				});
		});

		test('POST 400: throws an error when the request body is in an invalid format', () => {
			const comment = {
				nickname: 'butter_bridge',
				body: 'Wow I totally agree!',
			};
			return request(app)
				.post('/api/articles/3/comments')
				.send(comment)
				.expect(400)
				.then(({ body }) => {
					expect(body.msg).toEqual('Bad request');
				});
		});
	});
});

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
				expect(body.msg).toBe('404 - not found');
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
	})

	test('GET 404: responds with a 404 error when valid but non-existent id is given', () => {
		return request(app)
			.get('/api/articles/500')
			.expect(404)
			.then(({ body }) => {
				expect(body.msg).toEqual('404 - not found')
			})
	})
	test('GET 400: responds with a 400 error when an invalid id is given', () => {
		return request(app)
			.get('/api/articles/garbage')
			.expect(400)
			.then(({ body }) => {
				expect(body.msg).toEqual('Bad request')
			});
	})
});

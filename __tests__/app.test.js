const app = require('../app');
const request = require('supertest');
const db = require('../db/connection');
const seed = require('../db/seeds/seed');
const data = require('../db/data/test-data/index');
const endpoints = require('../endpoints')

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
    test('GET 200: returns the same information in the endpoints json to the client', () =>{
        return request(app)
        .get('/api')
        .expect(200)
        .then(({body}) => {
            expect(body.endpoints).toEqual(endpoints)
        })
    })
})
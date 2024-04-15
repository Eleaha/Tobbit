const app = require('../app')
const request = require('supertest')
const db = require('../db/connection')
const seed = require('../db/seeds/seed')
const data = require('../db/data/test-data/index')

afterAll(() => {
    db.end()
})

beforeEach(() => {
    return seed(data)
})

//200 returns topics with slug and description

describe.skip('general errors', () => {
    test('ANY 404: returns a 404 error when given a path that doesn\'t exist', () => {

    })
})

describe('/api/topics', () =>{
    test('GET 200: returns all of the topics', () => {
        return request(app)
        .get('/api/topics')
        .expect(200)
        .then(({body}) => {
            const {topics} = body
            expect(topics.length).toBe(3)
            topics.forEach(topic =>{
                expect(typeof topic.description).toBe('string')
                expect(typeof topic.slug).toBe('string')
            })
        })
        })
    })

const { expect } = require('chai');
const knex = require('knex');
const supertest = require('supertest');
const app = require('../src/app');
const helpers = require('./test-helpers');

describe('Shows Endpoints', function() {

    // instantiate database
    let db

    // create core test data corpus
    const { testUsers, testShows } = helpers.makeShowsFixtures();

    before('Make knex instance', () => {
        db = knex({
            client: 'pg',
            connection: process.env.TEST_DATABASE_URL
        })
        app.set('db', db)
    });

    before('Cleanup', () => helpers.cleanTables(db) );

    after('Disconnect from db', () => db.destroy() );

    afterEach('Cleanup', () => helpers.cleanTables(db) );

    describe(`1) GET /api/shows/:userId`, () => {
        context(`A) Given shows in the database`, () => {
            beforeEach('insert users', () => {
                return db
                    .into('whats_next_users')
                    .insert(testUsers)
            })
            beforeEach('insert hikes', () => {
                return db
                    .into('whats_next_shows')
                    .insert(testShows)
            })

            it(`responds with 200 and all the shows`, () => {
                const activeUser = testUsers[0];
                const expectedShowsTemp = testShows.filter(show => 
                    show.user_id === activeUser.id
                );
                const expectedShows = expectedShowsTemp.map(show => 
                    helpers.serializeShowData(show)
                );
                return supertest(app)
                    .get('/api/shows/1')
                    // eventually put authorization header here
                    .expect(200, expectedShows)
            })

        })
    })

    describe(`2) POST /api/shows`, () => {
        context(`A) Given shows in the database`, () => {
            beforeEach('insert users', () => {
                return db
                    .into('whats_next_users')
                    .insert(testUsers)
            })
            beforeEach('insert hikes', () => {
                return db
                    .into('whats_next_shows')
                    .insert(testShows)
                    // reset seq counter to latest PK number
                    .then( () => {
                        return db.max('id').from('whats_next_shows')
                    })
                    .then( (maxId) => {
                        return db.raw(
                            `ALTER SEQUENCE 
                                whats_next_shows_id_seq 
                                RESTART WITH ${maxId[0].max+1};
                            `
                        )
                    })
            })

            it(`i) responds with 201 and adds the appropriate new _to-watch_ show to the database`, () => {
                const activeUser = testUsers[2]
                const newShow = helpers.makeNewToWatchShowObject(testUsers, testShows);
                const authToken = helpers.makeAuthToken(activeUser);
                
                return supertest(app)
                    .post('/api/shows')
                    .set('Authorization', `bearer ${authToken}`)
                    .send(newShow)
                    .expect(201)
                    .expect(res => {
                        expect(res.body.title).to.eql(newShow.title)
                    })
            })

            it(`ii) responds with 201 and adds the appropriate new _watched_ show to the database`, () => {
                const activeUser = testUsers[2]
                const newShow = helpers.makeNewWatchedShowObject(testUsers, testShows);
                const authToken = helpers.makeAuthToken(activeUser);
                
                return supertest(app)
                    .post('/api/shows')
                    .set('Authorization', `bearer ${authToken}`)
                    .send(newShow)
                    .expect(201)
                    .expect(res => {
                        expect(res.body.title).to.eql(newShow.title)
                    })
            })

        })
    })

    describe(`3) GET /api/shows/:showId`, () => {
        context(`A) Given shows in the database`, () => {
            beforeEach('insert users', () => {
                return db
                    .into('whats_next_users')
                    .insert(testUsers)
            })
            beforeEach('insert hikes', () => {
                return db
                    .into('whats_next_shows')
                    .insert(testShows)
            })

            it(`responds with 200 and the requested show`, () => {
                const desiredShowId = 1
                const activeUser = testUsers[0]
                const authToken = helpers.makeAuthToken(activeUser);
                const expectedShow = helpers.serializeShowData(testShows[desiredShowId-1]);

                return supertest(app)
                    .get(`/api/shows/1/${desiredShowId}`)
                    //.set('Authorization', `bearer ${authToken}`)
                    .expect(200, expectedShow)
            });

        })
    })

})
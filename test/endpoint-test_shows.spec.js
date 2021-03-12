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

    describe(`1) GET /api/shows/`, () => {
        context(`A) Given shows in the database`, () => {
            beforeEach('insert users', () => {
                return db
                    .into('whats_next_users')
                    .insert(testUsers)
            })
            beforeEach('insert shows', () => {
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
                const authToken = helpers.makeAuthToken(activeUser);

                return supertest(app)
                    .get('/api/shows/')
                    .set('Authorization', `bearer ${authToken}`)
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
            beforeEach('insert shows', () => {
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
            beforeEach('insert shows', () => {
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
                    .get(`/api/shows/${desiredShowId}`)
                    .set('Authorization', `bearer ${authToken}`)
                    .expect(200, expectedShow)
            });

        })
    })

    describe(`4) DELETE /api/shows/:showId`, () => {
        context(`A) Given shows in the database`, () => {
            beforeEach('insert users', () => {
                return db
                    .into('whats_next_users')
                    .insert(testUsers)
            })
            beforeEach('insert shows', () => {
                return db
                    .into('whats_next_shows')
                    .insert(testShows)
            })

            it(`i) responds with 204 and deletes the requested show`, () => {
                const activeUser = testUsers[0];
                const deleteShowTargetId = 2;
                const authToken = helpers.makeAuthToken(activeUser);

                // Generate expected shows list, having removed deleted show
                const expectedShows1 = testShows.filter(show => 
                    show.user_id === activeUser.id
                );
                const expectedShows2 = expectedShows1.filter(show => 
                    show.id !== deleteShowTargetId
                );
                const expectedShows = expectedShows2.map(show => 
                    helpers.serializeShowData(show)
                );
                
                return supertest(app)
                    .delete(`/api/shows/${deleteShowTargetId}`)
                    .set('Authorization', `bearer ${authToken}`)
                    .expect(204)
                    .then( () => {
                        return supertest(app)
                            .get(`/api/shows/`)
                            .set('Authorization', `bearer ${authToken}`)
                            .expect(200, expectedShows)
                    })
            })


        })
    })

    describe(`5) PATCH /api/shows/:showId`, () => {
        context(`A) Given shows in the database`, () => {
            beforeEach('insert users', () => {
                return db
                    .into('whats_next_users')
                    .insert(testUsers)
            })
            beforeEach('insert shows', () => {
                return db
                    .into('whats_next_shows')
                    .insert(testShows)
            })

            it(`i) responds with 204 and updates the requested show`, () => {
                const activeUser = testUsers[0];
                const patchShowTargetId = 2;
                const newShowInfo = {
                    title: 'Updated title'
                }
                const authToken = helpers.makeAuthToken(activeUser);

                return supertest(app)
                    .patch(`/api/shows/${patchShowTargetId}`)
                    .set('Authorization', `bearer ${authToken}`)
                    .send(newShowInfo)
                    .expect(204)
                    .then( () => {
                        return supertest(app)
                            .get(`/api/shows/${patchShowTargetId}`)
                            .set('Authorization', `bearer ${authToken}`)
                            .expect(200)
                            .then( (res) => {
                                expect(res.body.title).to.eql(newShowInfo.title)
                            })
                    })
            })
        })
    })
})
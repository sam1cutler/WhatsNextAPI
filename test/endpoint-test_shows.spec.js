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

    //console.log(testShows);

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

    describe(`1) GET /api/shows`, () => {
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
                const activeUser = testUsers[0]
                const expectedShowsTemp = testShows.filter(show => 
                    show.user_id === activeUser.id
                );
                const expectedShows = expectedShowsTemp.map(show => 
                    helpers.serializeShowData(show)
                );
                return supertest(app)
                    .get('/api/shows')
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
            })

            it(`i) responds with 201 and adds the appropriate new to-watch show to the database`, () => {
                const activeUser = testUsers[2]
                const newShow = helpers.makeNewToWatchShowObject(testUsers, testShows);
                console.log('in bad test')
                console.log(newShow);
                
                return supertest(app)
                    .post('/api/shows')
                    // eventually put authorization header here
                    .send(newShow)
                    .expect(201)
                    .expect(res => {
                        expect(res.body.title).to.eql(newShow.title)
                    })
            })

        })
    })

})
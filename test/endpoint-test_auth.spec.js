const { expect } = require('chai');
const knex = require('knex');
const supertest = require('supertest');
const app = require('../src/app');
const helpers = require('./test-helpers');

describe('Auth Endpoint', function() {

    // instantiate database
    let db

    // create core test data = users (don't need shows)
    const testUsers = helpers.makeUsersArray();

    //console.log(testUsers)

    before('Make knex instance', () => {
        db = knex({
            client: 'pg',
            connection: process.env.TEST_DATABASE_URL
        });
        app.set('db', db)
    });

    before('Cleanup', () => helpers.cleanTables(db) );

    after('Disconnect from db', () => db.destroy() );

    afterEach('Cleanup', () => helpers.cleanTables(db) );

    describe(`POST /api/auth`, () => {
        context(`A) Given users in the database`, () => {
            beforeEach('insert users', () => {
                return db
                    .into('whats_next_users')
                    .insert(testUsers)
            })

            it.skip(`responds to proper request with 200 and proper authToken`, () => {
                // Define active user
                const activeUser = testUsers[0];

                // Define the appropriate request body for that user
                const loginInfo = {
                    email: activeUser.email,
                    password: 'password'
                }

                // Define the authToken we should get in the response
                const expectedAuthToken = helpers.makeAuthToken(activeUser);

                // Make the request
                return supertest(app)
                    .post('/api/auth')
                    .send(loginInfo)
                    .expect(200)
                    .expect(res => {
                        expect(res.body.authToken).to.eql(expectedAuthToken)
                    })

            })

            it.skip(`responds to request with wrong password with 400 and proper error message`, () => {
                // Define active user
                const activeUser = testUsers[0];

                // Define the appropriate request body for that user
                const loginInfo = {
                    email: activeUser.email,
                    password: 'wrongpassword'
                }

                // Make the request
                return supertest(app)
                    .post('/api/auth')
                    .send(loginInfo)
                    .expect(400)
                    .expect(res => {
                        expect(res.body.error).to.eql(`Incorrect password.`)
                    })

            })
        })
        
    })


})
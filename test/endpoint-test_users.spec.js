const knex = require('knex');
const supertest = require('supertest');
const app = require('../src/app');
const helpers = require('./test-helpers');

describe('Users Endpoints', () => {
    
    let db

    const testUsers = helpers.makeUsersArray();

    before('Make knex instance', () => {
        db = knex({
            client: 'pg',
            connection: process.env.TEST_DATABASE_URL
        })
        app.set('db', db)
    })

    before('Cleanup', () => helpers.cleanTables(db) );

    after('Disconnect from db', () => db.destroy() );

    afterEach('Cleanup', () => helpers.cleanTables(db) );

    describe(`1) GET /api/users`, () => {
        context(`A) Given users in the database`, () => {
            beforeEach('insert users', () => {
                return db
                    .into('whats_next_users')
                    .insert(testUsers)
            })

            it(`responds with 200 and all the users`, () => {
                const expectedUsers = testUsers;

                return supertest(app)
                    .get('/api/users')
                    .expect(200, expectedUsers)
            })
        })

    })

    describe(`2) POST /api/users`, () => {
        context(`A) Given users in the database`, () => {
            beforeEach('insert users', () => {
                return db
                    .into('whats_next_users')
                    .insert(testUsers)
                    // reset seq counter to latest PK number
                    .then( () => {
                        return db.max('id').from('whats_next_users')
                    })
                    .then( (maxId) => {
                        return db.raw(
                            `ALTER SEQUENCE 
                                whats_next_users_id_seq 
                                RESTART WITH ${maxId[0].max+1};
                            `
                        )
                    })
            })

            it(`responds with 201 and adds the new user`, () => {

                // *** NEED TO FIX - NOT WORKING AS WRITTEN -
                //     BCRYPTED PASSWORD DOESN'T MATCH PROPERLY
                const newUser = {
                    email: 'test6@test.com',
                    display_name: 'test6',
                    password: 'aBaB1!1!'
                }

                return supertest(app)
                    .post('/api/users')
                    .send(newUser)
                    .expect(201)
                    /*
                    .then( () => {
                        return supertest(app)
                            .get('/api/users/get/6')
                            .expect(200)
                            .then( (response) => {
                                response.body
                                //bcrypt.compare(plaintextPw, response.body.pw) --> returns true
                                return bcrypt.compare(
                                    newUser.password, response.body.password
                                )
                                    .then(answer => {

                                    })
                            })
                    })
                    */
                    
                    
            })
        })

    })

    describe(`3) GET /api/users/:userId`, () => {
        context(`A) Given users in the database`, () => {
            beforeEach('insert users', () => {
                return db
                    .into('whats_next_users')
                    .insert(testUsers)
            })

            it(`responds with 200 and the requested user`, () => {
                const expectedUsersId = 2;
                const expectedUser = testUsers[expectedUsersId-1];

                return supertest(app)
                    .get(`/api/users/${expectedUsersId}`)
                    .expect(200, expectedUser)
            })
        })

    })

    describe(`4) DELETE /api/users/:userId`, () => {
        context(`A) Given users in the database`, () => {
            beforeEach('insert users', () => {
                return db
                    .into('whats_next_users')
                    .insert(testUsers)
            })

            it(`responds with 204 and removes the requested user`, () => {
                const userToBeDeletedId = 2;
                const authToken = helpers.makeAuthToken(testUsers[userToBeDeletedId-1]);
                
                const expectedUsers = testUsers.filter(user => 
                    user.id !== userToBeDeletedId)

                return supertest(app)
                    .delete(`/api/users/${userToBeDeletedId}`)
                    .set('Authorization', `bearer ${authToken}`)
                    .expect(204)
                    .then( () => {
                        return supertest(app)
                            .get(`/api/users`)
                            .expect(200, expectedUsers)
                    })
            })
        })

    })

    describe(`5) PATCH /api/users/:userId`, () => {
        context(`A) Given users in the database`, () => {
            beforeEach('insert users', () => {
                return db
                    .into('whats_next_users')
                    .insert(testUsers)
            })

            it(`responds with 204 and removes the requested user`, () => {
                const userToBePatchedId = 2;
                const authToken = helpers.makeAuthToken(testUsers[userToBePatchedId-1]);
                
                updatedInfo = {
                    display_name: 'updated_name'
                }

                const expectedUser = testUsers[userToBePatchedId-1];
                expectedUser['display_name'] = 'updated_name'

                return supertest(app)
                    .patch(`/api/users/${userToBePatchedId}`)
                    .send(updatedInfo)
                    .set('Authorization', `bearer ${authToken}`)
                    .expect(204)
                    .then( () => {
                        return supertest(app)
                            .get(`/api/users/${userToBePatchedId}`)
                            .expect(200, expectedUser)
                    })
            })
        })

    })

})
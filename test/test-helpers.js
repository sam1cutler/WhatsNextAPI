// const bcrypt = require('bcryptjs');
// const jwt = require('jsonwebtoken');
const xss = require('xss');

function makeUsersArray() {
    return [
        {
            id: 1,
            email: 'test1@test.com',
            display_name: 'test1',
            password: 'password',
            friends: '2 3 4'
        },
        {
            id: 2,
            email: 'test2@test.com',
            display_name: 'test2',
            password: 'password',
            friends: '1 3 4'
        },
        {
            id: 3,
            email: 'test3@test.com',
            display_name: 'test3',
            password: 'password',
            friends: '2 3 4'
        },
        {
            id: 4,
            email: 'test4@test.com',
            display_name: 'test4',
            password: 'password',
            friends: '2 3 4'
        },
        {
            id: 5,
            email: 'test5@test.com',
            display_name: 'test5',
            password: 'password',
            friends: '2 3 4'
        },
    ]
}

function makeShowsArray(users) {
    return [
        {
            id: 1,
            user_id: users[0].id,
            title: 'First show',
            service: 'Netflix',
            genre: 'Comedy',
            watched: true,
            priority: null,
            completed: '01-Jan-2021',
            rating: 4
        },
        {
            id: 2,
            user_id: users[0].id,
            title: 'Second show',
            service: 'Hulu',
            genre: 'Drame',
            watched: true,
            priority: null,
            completed: '01-Feb-2021',
            rating: 3
        },
        {
            id: 3,
            user_id: users[1].id,
            title: 'Third show',
            service: 'Amazon Prime',
            genre: 'Documentary',
            watched: false,
            priority: 1,
            completed: null,
            rating: null
        },
        {
            id: 4,
            user_id: users[0].id,
            title: 'Fourth show',
            service: 'Netflix',
            genre: 'Crime',
            watched: false,
            priority: 1,
            completed: null,
            rating: null
        },
        {
            id: 5,
            user_id: users[0].id,
            title: 'Fifth show',
            service: 'Hulu',
            genre: 'Comedy',
            watched: false,
            priority: 2,
            completed: null,
            rating: null
        }
    ]
}

function makeShowsFixtures() {
    const testUsers = makeUsersArray();
    const testShows = makeShowsArray(testUsers);
    return { 
        testUsers,
        testShows
    }
}

function makeNewToWatchShowObject(users, shows) {
    return {
        user_id: users[2].id,
        title: 'Sixth show',
        service: 'HBO Max',
        genre: 'Horror',
        watched: false,
        priority: 2,
        completed: null,
        rating: null 
    }
}

function makeNewWatchedShowObject(users, shows) {
    return {
        user_id: users[2].id,
        title: 'Seventh show',
        service: 'HBO Max',
        genre: 'Comedy',
        watched: true,
        priority: null,
        completed: '01-Nov-2020',
        rating: 5 
    }
}


function restartCounter(db, table) {
    return db.transaction(trx => 
        trx.raw(
            `SELECT 
                setval(\'${table}_id_seq\', (SELECT MAX(id) from "${table}"));
            `
        )    
    )
}

function cleanTables(db) {
    return db.transaction(trx => 
        trx.raw(
            `TRUNCATE
                whats_next_users,
                whats_next_shows
                RESTART IDENTITY
            `
        )
    )
}

function serializeShowData(show) {
    
    const reformattedCompletion = (show.completed == null)
        ? null
        : new Date(show.completed).toISOString()

    return {
        id: show.id,
        user_id: show.user_id,
        title: xss(show.title),
        service: xss(show.service),
        genre: xss(show.genre),
        watched: show.watched,
        priority: show.priority,
        completed: reformattedCompletion,
        rating: show.rating
    }
}

module.exports = {
    makeUsersArray,
    makeShowsArray,
    makeShowsFixtures,
    cleanTables,
    serializeShowData,
    makeNewToWatchShowObject,
    makeNewWatchedShowObject,
    restartCounter
}
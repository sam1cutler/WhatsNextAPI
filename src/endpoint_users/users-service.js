const xss = require('xss');
const bcrypt = require('bcryptjs');

const REGEX_UPPER_LOWER_NUMBER_SPECIAL = /(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#\$%\^&])[\S]+/

const UsersService = {
    serializeUser(user) {
        return {
            id: user.id,
            email: xss(user.email),
            display_name: xss(user.display_name),
            password: xss(user.password),
        }
    },
    serializeUserPublic(user) {
        return {
            id: user.id,
            email: xss(user.email),
            display_name: xss(user.display_name),
        }
    },
    getAllUsers(knex) {
        return knex
            .select('*')
            .from('whats_next_users')
    },
    getUserById(knex, id) {
        return knex
            .from('whats_next_users')
            .select('*')
            .where( { id } )
            .first()
    },
    insertUser(knex, newUser) {
        return knex
            .insert(newUser)
            .into('whats_next_users')
            .returning('*')
            .then(rows => {
                return rows[0]
            })
    },
    deleteUser(knex, id) {
        return knex
            .from('whats_next_users')
            .where( { id } )
            .delete()
    },
    updateUser(knex, id, newUserInfo) {
        return knex
            .from('whats_next_users')
            .where( { id } )
            .update(newUserInfo)
    },
    validatePassword(password) {
        if (password.length < 8) {
            return 'Password must be at least 8 characters in length.'
        }
        if (password.length > 72) {
            return 'Password must be no more than 72 characters in length.'
        }
        if ( password.startsWith(' ') || password.endsWith(' ') ) {
            return 'Password must not start or end with empty spaces.'
        }
        if (!REGEX_UPPER_LOWER_NUMBER_SPECIAL.test(password)) {
            return 'Password must contain at least one upper case letter, lower case letter, number, and special character.'
        }
        return null
    },
    hashPassword(password) {
        return bcrypt.hash(password, 12)
    },
    checkForUserWithEmail(knex, email) {
        return knex
            .from('whats_next_users')
            .where( { email } )
            .first()
            .then(user => user)
    },
    checkForUserWithDisplayName(knex, display_name) {
        return knex
            .from('whats_next_users')
            .where( { display_name } )
            .first()
            .then(user => user)
    }
}

module.exports = UsersService;
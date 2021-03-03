const xss = require('xss');

const showsService = {
    
    serializeShowData(show) {
        return {
            id: show.id,
            user_id: show.user_id,
            title: xss(show.title),
            service: xss(show.service),
            genre: xss(show.genre),
            watched: show.watched,
            priority: show.priority,
            completed: show.completed,
            rating: show.rating
        }
    },

    getAllShows(knex, user_id) {
        return knex
            .select('*')
            .from('whats_next_shows')
            .where(
                'user_id',
                '=',
                user_id
            )
    },

    getShowById(knex, show_id) {
        return knex
            .from('whats_next_shows')
            .select('*')
            .where('id', show_id)
            .first()
    },

    insertShow(knex, newShow) {
        return knex
            .insert(newShow)
            .into('whats_next_shows')
            .returning('*')
            .then(rows => {
                return rows[0]
            })
    },


}

module.exports = showsService;
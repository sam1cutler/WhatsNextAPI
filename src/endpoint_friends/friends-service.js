const FriendsService = {
    getFriends(knex, source) {
        return knex
            .from('whats_next_friends')    
            .select('*')
            .where( { source } )
    },
    makeNewConnection(knex, newConnection) {
        return knex
            .insert(newConnection)
            .into('whats_next_friends')
            .returning('*')
            .then(rows => {
                return rows[0]
            })
    },
    getSpecificConnection(knex, id) {
        return knex
            .from('whats_next_friends')
            .select('*')
            .where( {id} )
            .first()
    },
    deleteConnection(knex, id) {
        return knex
            .from('whats_next_friends')
            .where( { id } )
            .delete()
    }
}

module.exports = FriendsService;
DROP TABLE IF EXISTS whats_next_friends;

CREATE TABLE whats_next_friends (
    id INTEGER PRIMARY KEY GENERATED BY DEFAULT AS IDENTITY,
    source INTEGER REFERENCES whats_next_users(id) ON DELETE CASCADE NOT NULL,
    recipient_id INTEGER REFERENCES whats_next_users(id) ON DELETE CASCADE NOT NULL,
    recipient_name TEXT REFERENCES whats_next_users(display_name) ON DELETE CASCADE NOT NULL
)
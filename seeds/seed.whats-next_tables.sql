BEGIN;

TRUNCATE
    whats_next_shows,
    whats_next_users,
    whats_next_friends
    RESTART IDENTITY CASCADE;

INSERT INTO whats_next_users
    (email, display_name, password)
VALUES
    ('jason@gmail.com', 'Jason', '$2a$12$RMZQRtib0KWblIizPt5knuudCQ/xJWartO4wr0wVI9dF7P4tgX3ai'),
    ('johanna@gmail.com', 'Jo', '$2a$12$k2F2.ERE/Pd4J77D.TADeunrmQiLnxXGw2eBdOHVHiIQriGQ/DRdy'),
    ('monty@gmail.com', 'Monty', '$2a$12$w.dXgpN2C/3JtjfKeYLfqus7OKmybMB.EEOBRIAJHIBRHLESpuzEm'),
    ('jeremy@gmail.com', 'Jeremy', '$2a$12$3m0jbQAs6HH1oZx1.M8NvOTrHk6W1YAvCF8p.wy.htYRCwyUwfW5.'),
    ('margalit@gmail.com', 'Margalit', '$2a$12$RMZQRtib0KWblIizPt5knuudCQ/xJWartO4wr0wVI9dF7P4tgX3ai'),
    ('arielle@yahoo.com', 'Ari', '$2a$12$Jvc0qOjbZiCTwxrtEjyKReDZ77MD9dzUefHdwo9D0gxd5sl2DUEHW'),
    ('susan@outlook.com', 'Susan', '$2a$12$N5TTbGvZlzh/lpj1PkoeJuGwGHcfAoNYdyfUvld4Z8poXs2N/sW1W');

INSERT INTO whats_next_shows
    (user_id, title, service, genre, watched, priority, completed, rating)
VALUES
    (
        1,
        'The Great British Bakeoff',
        'Netflix',
        'Cooking',
        true,
        null,
        '2020-12-01T00:00:00.000Z',
        4
    ),
    (
        1,
        'The Watchmen',
        'HBO Max',
        'SciFi',
        true,
        null,
        '2020-10-01T00:00:00.000Z',
        5
    ),
    (
        1,
        'Atlanta',
        'Hulu',
        'Drama',
        false,
        1,
        null,
        null
    ),
    (
        1,
        'Trapped',
        'Amazon Prime',
        'Crime',
        false,
        2,
        null,
        null
    ),
    (
        1,
        'The Expanse',
        'Amazon Prime',
        'SciFi',
        false,
        3,
        null,
        null
    ),
    (
        1,
        'Ted Lasso',
        'Apple TV',
        'Comedy',
        true,
        null,
        '2021-01-01T00:00:00.000Z',
        5
    ),
    (
        1,
        'Star Trek: TNG',
        'Netflix',
        'SciFi',
        false,
        4,
        null,
        null
    ),
    (
        1,
        'Mindhunter',
        'Netflix',
        'Crime',
        true,
        null,
        '2020-09-01T00:00:00.000Z',
        3
    ),
    (
        1,
        'Altered Carbon',
        'Netflix',
        'SciFi',
        true,
        null,
        '2020-07-01T00:00:00.000Z',
        2
    ),
    (
        1,
        'Schitt''s Creek',
        'Netflix',
        'Comedy',
        true,
        null,
        '2021-02-28T00:00:00.000Z',
        5
    ),
    (
        1,
        'Downton Abbey',
        'Amazon Prime',
        'Drama',
        false,
        8,
        null,
        null
    ),
    (
        2,
        'Queen''s Gambit',
        'Netflix',
        'Drama',
        true,
        null,
        '2020-12-01T00:00:00.000Z',
        4
    ),
    (
        2,
        'The Watchmen',
        'HBO Max',
        'SciFi',
        true,
        null,
        '2020-10-01T00:00:00.000Z',
        5
    ),
    (
        2,
        'Atlanta',
        'Hulu',
        'Drama',
        false,
        1,
        null,
        null
    ),
    (
        2,
        'Trapped',
        'Amazon Prime',
        'Crime',
        false,
        2,
        null,
        null
    ),
    (
        2,
        'The Expanse',
        'Amazon Prime',
        'SciFi',
        false,
        3,
        null,
        null
    ),
    (
        2,
        'Ted Lasso',
        'Apple TV',
        'Comedy',
        true,
        null,
        '2021-01-01T00:00:00.000Z',
        5
    ),
    (
        2,
        'Star Trek: TNG',
        'Netflix',
        'SciFi',
        false,
        4,
        null,
        null
    ),
    (
        2,
        'Mindhunter',
        'Netflix',
        'Crime',
        true,
        null,
        '2020-09-01T00:00:00.000Z',
        3
    ),
    (
        2,
        'Altered Carbon',
        'Netflix',
        'SciFi',
        true,
        null,
        '2020-07-01T00:00:00.000Z',
        2
    ),
    (
        2,
        'Schitt''s Creek',
        'Netflix',
        'Comedy',
        true,
        null,
        '2021-02-28T00:00:00.000Z',
        5
    ),
    (
        2,
        'Downton Abbey',
        'Amazon Prime',
        'Drama',
        false,
        8,
        null,
        null
    ),
    (
        3,
        'Queen''s Gambit',
        'Netflix',
        'Drama',
        true,
        null,
        '2020-12-01T00:00:00.000Z',
        4
    ),
    (
        3,
        'The Watchmen',
        'HBO Max',
        'SciFi',
        true,
        null,
        '2020-10-01T00:00:00.000Z',
        5
    ),
    (
        3,
        'Futurama',
        'Hulu',
        'Comedy',
        false,
        1,
        null,
        null
    ),
    (
        3,
        'Trapped',
        'Amazon Prime',
        'Crime',
        false,
        2,
        null,
        null
    ),
    (
        3,
        'The Expanse',
        'Amazon Prime',
        'SciFi',
        false,
        3,
        null,
        null
    ),
    (
        3,
        'Ted Lasso',
        'Apple TV',
        'Comedy',
        true,
        null,
        '2021-01-01T00:00:00.000Z',
        5
    ),
    (
        3,
        'Star Trek: TNG',
        'Netflix',
        'SciFi',
        false,
        4,
        null,
        null
    ),
    (
        3,
        'Mindhunter',
        'Netflix',
        'Crime',
        true,
        null,
        '2020-09-01T00:00:00.000Z',
        3
    ),
    (
        3,
        'Altered Carbon',
        'Netflix',
        'SciFi',
        true,
        null,
        '2020-07-01T00:00:00.000Z',
        2
    ),
    (
        3,
        'Schitt''s Creek',
        'Netflix',
        'Comedy',
        true,
        null,
        '2021-02-28T00:00:00.000Z',
        5
    ),
    (
        3,
        'Downton Abbey',
        'Amazon Prime',
        'Drama',
        false,
        8,
        null,
        null
    ),
    (
        4,
        'The Watchmen',
        'HBO Max',
        'SciFi',
        true,
        null,
        '2020-10-01T00:00:00.000Z',
        5
    ),
    (
        4,
        'Atlanta',
        'Hulu',
        'Drama',
        false,
        1,
        null,
        null
    ),
    (
        4,
        'Trapped',
        'Amazon Prime',
        'Crime',
        false,
        2,
        null,
        null
    ),
    (
        4,
        'The Expanse',
        'Amazon Prime',
        'SciFi',
        false,
        3,
        null,
        null
    ),
    (
        4,
        'Ted Lasso',
        'Apple TV',
        'Comedy',
        true,
        null,
        '2021-01-01T00:00:00.000Z',
        5
    ),
    (
        4,
        'Star Trek: TNG',
        'Netflix',
        'SciFi',
        false,
        4,
        null,
        null
    ),
    (
        4,
        'Mindhunter',
        'Netflix',
        'Crime',
        true,
        null,
        '2020-09-01T00:00:00.000Z',
        3
    ),
    (
        4,
        'Altered Carbon',
        'Netflix',
        'SciFi',
        true,
        null,
        '2020-07-01T00:00:00.000Z',
        2
    ),
    (
        4,
        'Schitt''s Creek',
        'Netflix',
        'Comedy',
        true,
        null,
        '2021-02-28T00:00:00.000Z',
        5
    ),
    (
        4,
        'Downton Abbey',
        'Amazon Prime',
        'Drama',
        false,
        8,
        null,
        null
    );

INSERT INTO whats_next_friends
    (source, recipient_id, recipient_name)
VALUES
    (1, 2, 'Jo'),
    (1, 7, 'Susan'),
    (1, 5, 'Margalit'),
    (2, 3, 'Monty'),
    (2, 6, 'Ari'),
    (3, 2, 'Jo'),
    (5, 1, 'Jason'),
    (5, 6, 'Ari'),
    (5, 7, 'Susan'),
    (6, 5, 'Jeremy'),
    (7, 1, 'Jason'),
    (7, 5, 'Margalit'),
    (7, 6, 'Ari');

COMMIT;
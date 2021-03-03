BEGIN;

TRUNCATE
    whats_next_shows,
    whats_next_users
    RESTART IDENTITY CASCADE;

INSERT INTO whats_next_users
    (email, display_name, password, friends)
VALUES
    ('jason@gmail.com', 'Jason', '$2a$12$RMZQRtib0KWblIizPt5knuudCQ/xJWartO4wr0wVI9dF7P4tgX3ai', '2 5 6'),
    ('johanna@gmail.com', 'Jo', '$2a$12$k2F2.ERE/Pd4J77D.TADeunrmQiLnxXGw2eBdOHVHiIQriGQ/DRdy', '1 3'),
    ('monty@gmail.com', 'MTO', '$2a$12$w.dXgpN2C/3JtjfKeYLfqus7OKmybMB.EEOBRIAJHIBRHLESpuzEm', '2 4 5 6'),
    ('jeremy@gmail.com', 'Jeremy', '$2a$12$3m0jbQAs6HH1oZx1.M8NvOTrHk6W1YAvCF8p.wy.htYRCwyUwfW5.', '1 2'),
    ('margalit@gmail.com', 'Margalit', '$2a$12$RMZQRtib0KWblIizPt5knuudCQ/xJWartO4wr0wVI9dF7P4tgX3ai', '2 3 4 7'),
    ('arielle@yahoo.com', 'Ari', 'kL6^kL6^', '1 2 7'),
    ('susan@outlook.com', 'Susan', 'mNmN5%5%', '1 2 3 4 5 6');

INSERT INTO whats_next_shows
    (user_id, title, service, genre, watched, priority, completed, rating)
VALUES
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
    );

COMMIT;
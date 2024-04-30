CREATE TABLE users (
    id SERIAL PRIMARY KEY,
    username VARCHAR(24) NOT NULL UNIQUE,
    passhash VARCHAR NOT NULL,
    userId VARCHAR NOT NULL UNIQUE
);

INSERT INTO users(username, passhash) VALUES ($1, $2);
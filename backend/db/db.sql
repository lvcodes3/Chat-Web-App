-- 1. Create Database --
CREATE DATABASE chat_web_app
    WITH
    OWNER = postgres
    ENCODING = 'UTF8'
    CONNECTION LIMIT = -1
    IS_TEMPLATE = False;

-- 2. Before creating the users table we must run the command to enable UUID --
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- 3. Create users Table --
CREATE TABLE users(
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    username VARCHAR(15) NOT NULL UNIQUE,
    email VARCHAR(100) NOT NULL UNIQUE,
    password VARCHAR(60) NOT NULL,
    picture VARCHAR(50) NOT NULL,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    last_signed_in TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
);
-- using 'uuid PRIMARY KEY DEFAULT uuid_generate_v4()' instead of 'SERIAL PRIMARY KEY' because
-- it creates a long string id containing alphabet and integers, instead of just an integer id
-- this is for JWT purposes.

-- 4. Create messages Table --
CREATE TABLE messages(
    id SERIAL NOT NULL PRIMARY KEY,
    message VARCHAR(256) NOT NULL,
    sender UUID NOT NULL REFERENCES users(id),
    receiver UUID NOT NULL REFERENCES users(id),
    sent_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);
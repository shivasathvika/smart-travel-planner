-- Quick setup for development
CREATE USER travel_planner_user WITH PASSWORD 'dev_password_123';
CREATE DATABASE travel_planner_db OWNER travel_planner_user;
\c travel_planner_db

CREATE TABLE users (
    id SERIAL PRIMARY KEY,
    email VARCHAR(255) UNIQUE NOT NULL,
    hashed_password VARCHAR(255) NOT NULL,
    full_name VARCHAR(255)
);

CREATE TABLE travel_plans (
    id SERIAL PRIMARY KEY,
    user_id INTEGER REFERENCES users(id),
    title VARCHAR(255) NOT NULL,
    start_date DATE,
    end_date DATE
);

CREATE TABLE activities (
    id SERIAL PRIMARY KEY,
    travel_plan_id INTEGER REFERENCES travel_plans(id),
    name VARCHAR(255) NOT NULL,
    start_time TIMESTAMP,
    end_time TIMESTAMP
);

GRANT ALL PRIVILEGES ON DATABASE travel_planner_db TO travel_planner_user;
GRANT ALL PRIVILEGES ON ALL TABLES IN SCHEMA public TO travel_planner_user;

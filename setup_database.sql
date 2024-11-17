-- Quick setup script for development
CREATE USER travel_planner_user WITH PASSWORD 'dev_password_123';
CREATE DATABASE travel_planner_db WITH OWNER = travel_planner_user;
\c travel_planner_db

-- Essential tables only
CREATE TABLE users (
    id SERIAL PRIMARY KEY,
    email VARCHAR(255) UNIQUE NOT NULL,
    hashed_password VARCHAR(255) NOT NULL,
    full_name VARCHAR(255),
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    profile_picture VARCHAR(255),
    phone_number VARCHAR(50),
    bio TEXT,
    preferred_currency VARCHAR(10) DEFAULT 'USD',
    preferred_language VARCHAR(10) DEFAULT 'en',
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE travel_plans (
    id SERIAL PRIMARY KEY,
    user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
    title VARCHAR(255) NOT NULL,
    description TEXT,
    start_date DATE,
    end_date DATE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE activities (
    id SERIAL PRIMARY KEY,
    travel_plan_id INTEGER REFERENCES travel_plans(id) ON DELETE CASCADE,
    name VARCHAR(255) NOT NULL,
    description TEXT,
    start_time TIMESTAMP,
    end_time TIMESTAMP,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Add new tables
CREATE TABLE trips (
    id SERIAL PRIMARY KEY,
    user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
    destination VARCHAR(255) NOT NULL,
    start_date TIMESTAMP,
    end_date TIMESTAMP,
    notes TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE favorites (
    id SERIAL PRIMARY KEY,
    user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
    place_id VARCHAR(100) NOT NULL,
    place_name VARCHAR(255) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(user_id, place_id)
);

-- Grant permissions
GRANT ALL PRIVILEGES ON DATABASE travel_planner_db TO travel_planner_user;
GRANT ALL PRIVILEGES ON ALL TABLES IN SCHEMA public TO travel_planner_user;
GRANT ALL PRIVILEGES ON ALL SEQUENCES IN SCHEMA public TO travel_planner_user;
GRANT ALL PRIVILEGES ON TABLE trips TO travel_planner_user;
GRANT ALL PRIVILEGES ON TABLE favorites TO travel_planner_user;

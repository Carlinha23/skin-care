-- Create users table
CREATE TABLE users (
    user_id SERIAL PRIMARY KEY,
    name TEXT NOT NULL,
    email TEXT UNIQUE NOT NULL CHECK (position('@' IN email) > 1),
    username VARCHAR(25) UNIQUE NOT NULL,
    password TEXT NOT NULL
);

-- Create category table
CREATE TABLE category (
    category_id SERIAL PRIMARY KEY,
    name TEXT UNIQUE NOT NULL
);

-- Insert predefined categories into category table
INSERT INTO category (name) VALUES
    ('Moisturizer'),
    ('Cleanser'),
    ('Serum'),
    ('Sunscreen'),
    ('Exfoliation'),
    ('Eye Serum'),
    ('Eye Cream')
    ('Wrinkles'),
    ('Toner'),
    ('Face Masks'),
    ('Acne'),
    ('Lip balm'),
    ('Others'),
    

-- Create product table
CREATE TABLE product (
    product_id SERIAL PRIMARY KEY,
    name TEXT NOT NULL,
    category_id INTEGER NOT NULL REFERENCES category(category_id) ON DELETE CASCADE,
    brand TEXT NOT NULL,
    image TEXT
);

-- Create reviews table
CREATE TABLE reviews (
    review_id SERIAL PRIMARY KEY,
    user_id INTEGER NOT NULL REFERENCES users(user_id) ON DELETE CASCADE,
    product_id INTEGER NOT NULL REFERENCES product(product_id) ON DELETE CASCADE,
    category_id INTEGER NOT NULL REFERENCES category(category_id) ON DELETE CASCADE,
    rating INTEGER NOT NULL CHECK (rating >= 1 AND rating <= 5),
    comment TEXT,
    date TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE Users (
    UserID SERIAL PRIMARY KEY,
    Email VARCHAR(255) UNIQUE NOT NULL,
    Username VARCHAR(255) UNIQUE NOT NULL,
    Password VARCHAR(255) NOT NULL,
    FirstName VARCHAR(255) NOT NULL,
    LastName VARCHAR(255) NOT NULL,
    IsAdmin BOOLEAN NOT NULL
);

CREATE TABLE Category (
    CategoryID SERIAL PRIMARY KEY,
    Name VARCHAR(255) UNIQUE NOT NULL
);

-- Insert predefined categories into category table
INSERT INTO category (name) VALUES
    ('Moisturizer'),
    ('Cleanser'),
    ('Serum'),
    ('Sunscreen'),
    ('Exfoliation'),
    ('Eye Serum'),
    ('Eye Cream'),
    ('Wrinkles'),
    ('Toner'),
    ('Face Masks'),
    ('Acne'),
    ('Lip balm'),
    ('Others');
    

CREATE TABLE Reviews (
    ReviewID SERIAL PRIMARY KEY,
    Username VARCHAR(255) NOT NULL,
    CategoryID INT NOT NULL,
    ProductName VARCHAR(255) NOT NULL,
    Brand VARCHAR(255) NOT NULL,
    Comment TEXT,
    Image VARCHAR(255),
    Date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (Username) REFERENCES Users(Username),
    FOREIGN KEY (CategoryID) REFERENCES Category(CategoryID)
);


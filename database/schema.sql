-- Library Management System Database Schema
-- This schema includes Authors and Books with proper relationships

CREATE DATABASE IF NOT EXISTS library_management;
USE library_management;

-- Create Authors table
CREATE TABLE IF NOT EXISTS authors (
    id INT AUTO_INCREMENT PRIMARY KEY,
    first_name VARCHAR(100) NOT NULL,
    last_name VARCHAR(100) NOT NULL,
    email VARCHAR(255) UNIQUE,
    birth_date DATE,
    nationality VARCHAR(100),
    bio TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- Create Books table
CREATE TABLE IF NOT EXISTS books (
    id INT AUTO_INCREMENT PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    isbn VARCHAR(20) UNIQUE NOT NULL,
    author_id INT NOT NULL,
    genre VARCHAR(100),
    publication_date DATE,
    pages INT,
    price DECIMAL(10, 2),
    description TEXT,
    stock_quantity INT DEFAULT 0,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (author_id) REFERENCES authors(id) ON DELETE CASCADE ON UPDATE CASCADE
);

-- Create indexes for better performance
CREATE INDEX idx_books_author_id ON books(author_id);
CREATE INDEX idx_books_genre ON books(genre);
CREATE INDEX idx_books_isbn ON books(isbn);
CREATE INDEX idx_authors_email ON authors(email);

-- Insert sample data for testing
INSERT INTO authors (first_name, last_name, email, birth_date, nationality, bio) VALUES
('J.K.', 'Rowling', 'jk.rowling@email.com', '1965-07-31', 'British', 'British author best known for the Harry Potter series'),
('George', 'Orwell', 'g.orwell@email.com', '1903-06-25', 'British', 'English novelist and essayist, journalist and critic'),
('Agatha', 'Christie', 'a.christie@email.com', '1890-09-15', 'British', 'English writer known for her detective novels'),
('Stephen', 'King', 's.king@email.com', '1947-09-21', 'American', 'American author of horror, supernatural fiction, suspense, crime, science-fiction, and fantasy novels');

INSERT INTO books (title, isbn, author_id, genre, publication_date, pages, price, description, stock_quantity) VALUES
('Harry Potter and the Philosopher''s Stone', '978-0747532699', 1, 'Fantasy', '1997-06-26', 223, 12.99, 'The first book in the Harry Potter series', 25),
('Harry Potter and the Chamber of Secrets', '978-0747538493', 1, 'Fantasy', '1998-07-02', 251, 13.99, 'The second book in the Harry Potter series', 20),
('1984', '978-0451524935', 2, 'Dystopian Fiction', '1949-06-08', 328, 14.99, 'A dystopian social science fiction novel', 30),
('Animal Farm', '978-0451526342', 2, 'Political Satire', '1945-08-17', 112, 10.99, 'An allegorical novella about farm animals', 15),
('Murder on the Orient Express', '978-0062693662', 3, 'Mystery', '1934-01-01', 256, 11.99, 'A detective novel featuring Hercule Poirot', 18),
('The Shining', '978-0307743657', 4, 'Horror', '1977-01-28', 447, 15.99, 'A horror novel about a haunted hotel', 12);

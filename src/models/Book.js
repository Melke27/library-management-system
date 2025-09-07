const { promisePool } = require('../../config/database');

class Book {
  constructor(data) {
    this.id = data.id;
    this.title = data.title;
    this.isbn = data.isbn;
    this.author_id = data.author_id;
    this.genre = data.genre;
    this.publication_date = data.publication_date;
    this.pages = data.pages;
    this.price = data.price;
    this.description = data.description;
    this.stock_quantity = data.stock_quantity;
    this.created_at = data.created_at;
    this.updated_at = data.updated_at;
    
    // If author data is included
    if (data.author_first_name) {
      this.author = {
        id: data.author_id,
        first_name: data.author_first_name,
        last_name: data.author_last_name,
        email: data.author_email,
        nationality: data.author_nationality
      };
    }
  }

  // Create a new book
  static async create(bookData) {
    try {
      const { title, isbn, author_id, genre, publication_date, pages, price, description, stock_quantity } = bookData;
      
      const [result] = await promisePool.execute(
        'INSERT INTO books (title, isbn, author_id, genre, publication_date, pages, price, description, stock_quantity) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)',
        [title, isbn, author_id, genre, publication_date, pages, price, description, stock_quantity || 0]
      );
      
      return await this.findById(result.insertId);
    } catch (error) {
      throw new Error(`Error creating book: ${error.message}`);
    }
  }

  // Find all books
  static async findAll(limit = 50, offset = 0) {
    try {
      const [rows] = await promisePool.execute(
        `SELECT 
          b.*,
          a.first_name as author_first_name,
          a.last_name as author_last_name,
          a.email as author_email,
          a.nationality as author_nationality
         FROM books b 
         LEFT JOIN authors a ON b.author_id = a.id 
         ORDER BY b.created_at DESC 
         LIMIT ? OFFSET ?`,
        [limit, offset]
      );
      
      return rows.map(row => new Book(row));
    } catch (error) {
      throw new Error(`Error fetching books: ${error.message}`);
    }
  }

  // Find book by ID
  static async findById(id) {
    try {
      const [rows] = await promisePool.execute(
        `SELECT 
          b.*,
          a.first_name as author_first_name,
          a.last_name as author_last_name,
          a.email as author_email,
          a.nationality as author_nationality
         FROM books b 
         LEFT JOIN authors a ON b.author_id = a.id 
         WHERE b.id = ?`,
        [id]
      );
      
      if (rows.length === 0) {
        return null;
      }
      
      return new Book(rows[0]);
    } catch (error) {
      throw new Error(`Error finding book: ${error.message}`);
    }
  }

  // Find book by ISBN
  static async findByISBN(isbn) {
    try {
      const [rows] = await promisePool.execute(
        `SELECT 
          b.*,
          a.first_name as author_first_name,
          a.last_name as author_last_name,
          a.email as author_email,
          a.nationality as author_nationality
         FROM books b 
         LEFT JOIN authors a ON b.author_id = a.id 
         WHERE b.isbn = ?`,
        [isbn]
      );
      
      return rows.length > 0 ? new Book(rows[0]) : null;
    } catch (error) {
      throw new Error(`Error finding book by ISBN: ${error.message}`);
    }
  }

  // Update book
  static async update(id, updateData) {
    try {
      const fields = [];
      const values = [];
      
      Object.keys(updateData).forEach(key => {
        if (updateData[key] !== undefined) {
          fields.push(`${key} = ?`);
          values.push(updateData[key]);
        }
      });
      
      if (fields.length === 0) {
        throw new Error('No fields to update');
      }
      
      values.push(id);
      
      await promisePool.execute(
        `UPDATE books SET ${fields.join(', ')} WHERE id = ?`,
        values
      );
      
      return await this.findById(id);
    } catch (error) {
      throw new Error(`Error updating book: ${error.message}`);
    }
  }

  // Delete book
  static async delete(id) {
    try {
      const [result] = await promisePool.execute(
        'DELETE FROM books WHERE id = ?',
        [id]
      );
      
      return result.affectedRows > 0;
    } catch (error) {
      throw new Error(`Error deleting book: ${error.message}`);
    }
  }

  // Find books by author
  static async findByAuthor(authorId, limit = 20) {
    try {
      const [rows] = await promisePool.execute(
        `SELECT 
          b.*,
          a.first_name as author_first_name,
          a.last_name as author_last_name,
          a.email as author_email,
          a.nationality as author_nationality
         FROM books b 
         LEFT JOIN authors a ON b.author_id = a.id 
         WHERE b.author_id = ? 
         ORDER BY b.publication_date DESC 
         LIMIT ?`,
        [authorId, limit]
      );
      
      return rows.map(row => new Book(row));
    } catch (error) {
      throw new Error(`Error finding books by author: ${error.message}`);
    }
  }

  // Find books by genre
  static async findByGenre(genre, limit = 20) {
    try {
      const [rows] = await promisePool.execute(
        `SELECT 
          b.*,
          a.first_name as author_first_name,
          a.last_name as author_last_name,
          a.email as author_email,
          a.nationality as author_nationality
         FROM books b 
         LEFT JOIN authors a ON b.author_id = a.id 
         WHERE b.genre = ? 
         ORDER BY b.created_at DESC 
         LIMIT ?`,
        [genre, limit]
      );
      
      return rows.map(row => new Book(row));
    } catch (error) {
      throw new Error(`Error finding books by genre: ${error.message}`);
    }
  }

  // Search books
  static async search(searchTerm, limit = 20) {
    try {
      const searchPattern = `%${searchTerm}%`;
      const [rows] = await promisePool.execute(
        `SELECT 
          b.*,
          a.first_name as author_first_name,
          a.last_name as author_last_name,
          a.email as author_email,
          a.nationality as author_nationality
         FROM books b 
         LEFT JOIN authors a ON b.author_id = a.id 
         WHERE b.title LIKE ? OR b.isbn LIKE ? OR b.genre LIKE ? OR b.description LIKE ?
         ORDER BY b.created_at DESC 
         LIMIT ?`,
        [searchPattern, searchPattern, searchPattern, searchPattern, limit]
      );
      
      return rows.map(row => new Book(row));
    } catch (error) {
      throw new Error(`Error searching books: ${error.message}`);
    }
  }

  // Update stock quantity
  static async updateStock(id, quantity) {
    try {
      await promisePool.execute(
        'UPDATE books SET stock_quantity = ? WHERE id = ?',
        [quantity, id]
      );
      
      return await this.findById(id);
    } catch (error) {
      throw new Error(`Error updating book stock: ${error.message}`);
    }
  }

  // Get books with low stock
  static async getLowStock(threshold = 5) {
    try {
      const [rows] = await promisePool.execute(
        `SELECT 
          b.*,
          a.first_name as author_first_name,
          a.last_name as author_last_name,
          a.email as author_email,
          a.nationality as author_nationality
         FROM books b 
         LEFT JOIN authors a ON b.author_id = a.id 
         WHERE b.stock_quantity <= ? 
         ORDER BY b.stock_quantity ASC`,
        [threshold]
      );
      
      return rows.map(row => new Book(row));
    } catch (error) {
      throw new Error(`Error finding low stock books: ${error.message}`);
    }
  }
}

module.exports = Book;

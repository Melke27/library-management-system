const Book = require('../models/Book');
const Author = require('../models/Author');
const { validationResult } = require('express-validator');

class BookController {
  // GET /api/v1/books
  static async getAllBooks(req, res) {
    try {
      const { limit = 50, offset = 0, search, genre, author_id } = req.query;
      
      let books;
      if (search) {
        books = await Book.search(search, parseInt(limit));
      } else if (genre) {
        books = await Book.findByGenre(genre, parseInt(limit));
      } else if (author_id) {
        books = await Book.findByAuthor(author_id, parseInt(limit));
      } else {
        books = await Book.findAll(parseInt(limit), parseInt(offset));
      }
      
      res.json({
        success: true,
        data: books,
        meta: {
          limit: parseInt(limit),
          offset: parseInt(offset),
          total: books.length
        }
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: 'Error fetching books',
        error: error.message
      });
    }
  }

  // GET /api/v1/books/:id
  static async getBookById(req, res) {
    try {
      const { id } = req.params;
      
      const book = await Book.findById(id);
      if (!book) {
        return res.status(404).json({
          success: false,
          message: 'Book not found'
        });
      }
      
      res.json({
        success: true,
        data: book
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: 'Error fetching book',
        error: error.message
      });
    }
  }

  // GET /api/v1/books/isbn/:isbn
  static async getBookByISBN(req, res) {
    try {
      const { isbn } = req.params;
      
      const book = await Book.findByISBN(isbn);
      if (!book) {
        return res.status(404).json({
          success: false,
          message: 'Book not found'
        });
      }
      
      res.json({
        success: true,
        data: book
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: 'Error fetching book',
        error: error.message
      });
    }
  }

  // GET /api/v1/books/low-stock
  static async getLowStockBooks(req, res) {
    try {
      const { threshold = 5 } = req.query;
      
      const books = await Book.getLowStock(parseInt(threshold));
      
      res.json({
        success: true,
        data: books,
        meta: {
          threshold: parseInt(threshold),
          total: books.length
        }
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: 'Error fetching low stock books',
        error: error.message
      });
    }
  }

  // POST /api/v1/books
  static async createBook(req, res) {
    try {
      // Check for validation errors
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({
          success: false,
          message: 'Validation failed',
          errors: errors.array()
        });
      }
      
      const { title, isbn, author_id, genre, publication_date, pages, price, description, stock_quantity } = req.body;
      
      // Check if book with ISBN already exists
      const existingBook = await Book.findByISBN(isbn);
      if (existingBook) {
        return res.status(409).json({
          success: false,
          message: 'Book with this ISBN already exists'
        });
      }
      
      // Check if author exists
      const author = await Author.findById(author_id);
      if (!author) {
        return res.status(404).json({
          success: false,
          message: 'Author not found'
        });
      }
      
      const book = await Book.create({
        title,
        isbn,
        author_id,
        genre,
        publication_date,
        pages,
        price,
        description,
        stock_quantity
      });
      
      res.status(201).json({
        success: true,
        message: 'Book created successfully',
        data: book
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: 'Error creating book',
        error: error.message
      });
    }
  }

  // PUT /api/v1/books/:id
  static async updateBook(req, res) {
    try {
      const { id } = req.params;
      
      // Check for validation errors
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({
          success: false,
          message: 'Validation failed',
          errors: errors.array()
        });
      }
      
      const book = await Book.findById(id);
      if (!book) {
        return res.status(404).json({
          success: false,
          message: 'Book not found'
        });
      }
      
      const { isbn, author_id } = req.body;
      
      // Check if ISBN is being changed and if it already exists
      if (isbn && isbn !== book.isbn) {
        const existingBook = await Book.findByISBN(isbn);
        if (existingBook) {
          return res.status(409).json({
            success: false,
            message: 'Book with this ISBN already exists'
          });
        }
      }
      
      // Check if author exists if author_id is being changed
      if (author_id && author_id !== book.author_id) {
        const author = await Author.findById(author_id);
        if (!author) {
          return res.status(404).json({
            success: false,
            message: 'Author not found'
          });
        }
      }
      
      const updatedBook = await Book.update(id, req.body);
      
      res.json({
        success: true,
        message: 'Book updated successfully',
        data: updatedBook
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: 'Error updating book',
        error: error.message
      });
    }
  }

  // PATCH /api/v1/books/:id/stock
  static async updateBookStock(req, res) {
    try {
      const { id } = req.params;
      const { stock_quantity } = req.body;
      
      if (typeof stock_quantity !== 'number' || stock_quantity < 0) {
        return res.status(400).json({
          success: false,
          message: 'Stock quantity must be a non-negative number'
        });
      }
      
      const book = await Book.findById(id);
      if (!book) {
        return res.status(404).json({
          success: false,
          message: 'Book not found'
        });
      }
      
      const updatedBook = await Book.updateStock(id, stock_quantity);
      
      res.json({
        success: true,
        message: 'Book stock updated successfully',
        data: updatedBook
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: 'Error updating book stock',
        error: error.message
      });
    }
  }

  // DELETE /api/v1/books/:id
  static async deleteBook(req, res) {
    try {
      const { id } = req.params;
      
      const book = await Book.findById(id);
      if (!book) {
        return res.status(404).json({
          success: false,
          message: 'Book not found'
        });
      }
      
      const deleted = await Book.delete(id);
      
      if (deleted) {
        res.json({
          success: true,
          message: 'Book deleted successfully'
        });
      } else {
        res.status(500).json({
          success: false,
          message: 'Failed to delete book'
        });
      }
    } catch (error) {
      res.status(500).json({
        success: false,
        message: 'Error deleting book',
        error: error.message
      });
    }
  }
}

module.exports = BookController;

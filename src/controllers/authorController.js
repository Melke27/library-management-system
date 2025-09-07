const Author = require('../models/Author');
const { validationResult } = require('express-validator');

class AuthorController {
  // GET /api/v1/authors
  static async getAllAuthors(req, res) {
    try {
      const { limit = 50, offset = 0, search } = req.query;
      
      let authors;
      if (search) {
        authors = await Author.search(search, parseInt(limit));
      } else {
        authors = await Author.findAll(parseInt(limit), parseInt(offset));
      }
      
      res.json({
        success: true,
        data: authors,
        meta: {
          limit: parseInt(limit),
          offset: parseInt(offset),
          total: authors.length
        }
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: 'Error fetching authors',
        error: error.message
      });
    }
  }

  // GET /api/v1/authors/:id
  static async getAuthorById(req, res) {
    try {
      const { id } = req.params;
      
      const author = await Author.findById(id);
      if (!author) {
        return res.status(404).json({
          success: false,
          message: 'Author not found'
        });
      }
      
      res.json({
        success: true,
        data: author
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: 'Error fetching author',
        error: error.message
      });
    }
  }

  // GET /api/v1/authors/:id/books
  static async getAuthorBooks(req, res) {
    try {
      const { id } = req.params;
      
      const author = await Author.findById(id);
      if (!author) {
        return res.status(404).json({
          success: false,
          message: 'Author not found'
        });
      }
      
      const books = await Author.getBooksById(id);
      
      res.json({
        success: true,
        data: {
          author: author,
          books: books
        },
        meta: {
          total_books: books.length
        }
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: 'Error fetching author books',
        error: error.message
      });
    }
  }

  // POST /api/v1/authors
  static async createAuthor(req, res) {
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
      
      const { first_name, last_name, email, birth_date, nationality, bio } = req.body;
      
      // Check if author with email already exists
      if (email) {
        const existingAuthor = await Author.findByEmail(email);
        if (existingAuthor) {
          return res.status(409).json({
            success: false,
            message: 'Author with this email already exists'
          });
        }
      }
      
      const author = await Author.create({
        first_name,
        last_name,
        email,
        birth_date,
        nationality,
        bio
      });
      
      res.status(201).json({
        success: true,
        message: 'Author created successfully',
        data: author
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: 'Error creating author',
        error: error.message
      });
    }
  }

  // PUT /api/v1/authors/:id
  static async updateAuthor(req, res) {
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
      
      const author = await Author.findById(id);
      if (!author) {
        return res.status(404).json({
          success: false,
          message: 'Author not found'
        });
      }
      
      const { email } = req.body;
      
      // Check if email is being changed and if it already exists
      if (email && email !== author.email) {
        const existingAuthor = await Author.findByEmail(email);
        if (existingAuthor) {
          return res.status(409).json({
            success: false,
            message: 'Author with this email already exists'
          });
        }
      }
      
      const updatedAuthor = await Author.update(id, req.body);
      
      res.json({
        success: true,
        message: 'Author updated successfully',
        data: updatedAuthor
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: 'Error updating author',
        error: error.message
      });
    }
  }

  // DELETE /api/v1/authors/:id
  static async deleteAuthor(req, res) {
    try {
      const { id } = req.params;
      
      const author = await Author.findById(id);
      if (!author) {
        return res.status(404).json({
          success: false,
          message: 'Author not found'
        });
      }
      
      const deleted = await Author.delete(id);
      
      if (deleted) {
        res.json({
          success: true,
          message: 'Author deleted successfully'
        });
      } else {
        res.status(500).json({
          success: false,
          message: 'Failed to delete author'
        });
      }
    } catch (error) {
      res.status(500).json({
        success: false,
        message: 'Error deleting author',
        error: error.message
      });
    }
  }
}

module.exports = AuthorController;

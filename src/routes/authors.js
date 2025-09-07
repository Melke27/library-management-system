const express = require('express');
const AuthorController = require('../controllers/authorController');
const { authorValidation, paramValidation } = require('../middleware/validation');

const router = express.Router();

// GET /api/v1/authors - Get all authors (with optional search and pagination)
router.get('/', AuthorController.getAllAuthors);

// Simple test endpoint (must come before parameterized routes)
router.get('/test', (req, res) => {
  res.json({ success: true, message: 'Authors route working' });
});

// GET /api/v1/authors/:id/books - Get books by author (must come before generic :id route)
router.get('/:id/books', paramValidation.id, AuthorController.getAuthorBooks);

// GET /api/v1/authors/:id - Get author by ID
router.get('/:id', paramValidation.id, AuthorController.getAuthorById);

// POST /api/v1/authors - Create new author
router.post('/', authorValidation.create, AuthorController.createAuthor);

// PUT /api/v1/authors/:id - Update author
router.put('/:id', paramValidation.id, authorValidation.update, AuthorController.updateAuthor);

// DELETE /api/v1/authors/:id - Delete author
router.delete('/:id', paramValidation.id, AuthorController.deleteAuthor);

module.exports = router;

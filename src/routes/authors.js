const express = require('express');
const AuthorController = require('../controllers/authorController');
const { authorValidation, paramValidation } = require('../middleware/validation');

const router = express.Router();

// GET /api/v1/authors - Get all authors (with optional search and pagination)
router.get('/', AuthorController.getAllAuthors);

// GET /api/v1/authors/:id - Get author by ID
router.get('/:id', paramValidation.id, AuthorController.getAuthorById);

// GET /api/v1/authors/:id/books - Get books by author
router.get('/:id/books', paramValidation.id, AuthorController.getAuthorBooks);

// POST /api/v1/authors - Create new author
router.post('/', authorValidation.create, AuthorController.createAuthor);

// PUT /api/v1/authors/:id - Update author
router.put('/:id', paramValidation.id, authorValidation.update, AuthorController.updateAuthor);

// DELETE /api/v1/authors/:id - Delete author
router.delete('/:id', paramValidation.id, AuthorController.deleteAuthor);

module.exports = router;

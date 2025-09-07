const express = require('express');
const BookController = require('../controllers/bookController');
const { bookValidation, paramValidation } = require('../middleware/validation');

const router = express.Router();

// GET /api/v1/books/low-stock - Get books with low stock (must be before /:id)
router.get('/low-stock', BookController.getLowStockBooks);

// GET /api/v1/books/isbn/:isbn - Get book by ISBN
router.get('/isbn/:isbn', paramValidation.isbn, BookController.getBookByISBN);

// GET /api/v1/books - Get all books (with optional filters and pagination)
router.get('/', BookController.getAllBooks);

// GET /api/v1/books/:id - Get book by ID
router.get('/:id', paramValidation.id, BookController.getBookById);

// POST /api/v1/books - Create new book
router.post('/', bookValidation.create, BookController.createBook);

// PUT /api/v1/books/:id - Update book
router.put('/:id', paramValidation.id, bookValidation.update, BookController.updateBook);

// PATCH /api/v1/books/:id/stock - Update book stock quantity
router.patch('/:id/stock', paramValidation.id, BookController.updateBookStock);

// DELETE /api/v1/books/:id - Delete book
router.delete('/:id', paramValidation.id, BookController.deleteBook);

module.exports = router;

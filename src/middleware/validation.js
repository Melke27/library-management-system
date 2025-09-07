const { body, param } = require('express-validator');

// Author validation rules
const authorValidation = {
  create: [
    body('first_name')
      .notEmpty()
      .withMessage('First name is required')
      .isLength({ min: 2, max: 100 })
      .withMessage('First name must be between 2 and 100 characters'),
    
    body('last_name')
      .notEmpty()
      .withMessage('Last name is required')
      .isLength({ min: 2, max: 100 })
      .withMessage('Last name must be between 2 and 100 characters'),
    
    body('email')
      .optional()
      .isEmail()
      .withMessage('Please provide a valid email address')
      .normalizeEmail(),
    
    body('birth_date')
      .optional()
      .isDate()
      .withMessage('Please provide a valid birth date in YYYY-MM-DD format'),
    
    body('nationality')
      .optional()
      .isLength({ max: 100 })
      .withMessage('Nationality must not exceed 100 characters'),
    
    body('bio')
      .optional()
      .isLength({ max: 5000 })
      .withMessage('Bio must not exceed 5000 characters')
  ],
  
  update: [
    body('first_name')
      .optional()
      .isLength({ min: 2, max: 100 })
      .withMessage('First name must be between 2 and 100 characters'),
    
    body('last_name')
      .optional()
      .isLength({ min: 2, max: 100 })
      .withMessage('Last name must be between 2 and 100 characters'),
    
    body('email')
      .optional()
      .isEmail()
      .withMessage('Please provide a valid email address')
      .normalizeEmail(),
    
    body('birth_date')
      .optional()
      .isDate()
      .withMessage('Please provide a valid birth date in YYYY-MM-DD format'),
    
    body('nationality')
      .optional()
      .isLength({ max: 100 })
      .withMessage('Nationality must not exceed 100 characters'),
    
    body('bio')
      .optional()
      .isLength({ max: 5000 })
      .withMessage('Bio must not exceed 5000 characters')
  ]
};

// Book validation rules
const bookValidation = {
  create: [
    body('title')
      .notEmpty()
      .withMessage('Title is required')
      .isLength({ min: 1, max: 255 })
      .withMessage('Title must be between 1 and 255 characters'),
    
    body('isbn')
      .notEmpty()
      .withMessage('ISBN is required')
      .isLength({ min: 10, max: 20 })
      .withMessage('ISBN must be between 10 and 20 characters'),
    
    body('author_id')
      .notEmpty()
      .withMessage('Author ID is required')
      .isInt({ min: 1 })
      .withMessage('Author ID must be a positive integer'),
    
    body('genre')
      .optional()
      .isLength({ max: 100 })
      .withMessage('Genre must not exceed 100 characters'),
    
    body('publication_date')
      .optional()
      .isDate()
      .withMessage('Please provide a valid publication date in YYYY-MM-DD format'),
    
    body('pages')
      .optional()
      .isInt({ min: 1 })
      .withMessage('Pages must be a positive integer'),
    
    body('price')
      .optional()
      .isDecimal({ decimal_digits: '0,2' })
      .withMessage('Price must be a decimal with up to 2 decimal places'),
    
    body('description')
      .optional()
      .isLength({ max: 5000 })
      .withMessage('Description must not exceed 5000 characters'),
    
    body('stock_quantity')
      .optional()
      .isInt({ min: 0 })
      .withMessage('Stock quantity must be a non-negative integer')
  ],
  
  update: [
    body('title')
      .optional()
      .isLength({ min: 1, max: 255 })
      .withMessage('Title must be between 1 and 255 characters'),
    
    body('isbn')
      .optional()
      .isLength({ min: 10, max: 20 })
      .withMessage('ISBN must be between 10 and 20 characters'),
    
    body('author_id')
      .optional()
      .isInt({ min: 1 })
      .withMessage('Author ID must be a positive integer'),
    
    body('genre')
      .optional()
      .isLength({ max: 100 })
      .withMessage('Genre must not exceed 100 characters'),
    
    body('publication_date')
      .optional()
      .isDate()
      .withMessage('Please provide a valid publication date in YYYY-MM-DD format'),
    
    body('pages')
      .optional()
      .isInt({ min: 1 })
      .withMessage('Pages must be a positive integer'),
    
    body('price')
      .optional()
      .isDecimal({ decimal_digits: '0,2' })
      .withMessage('Price must be a decimal with up to 2 decimal places'),
    
    body('description')
      .optional()
      .isLength({ max: 5000 })
      .withMessage('Description must not exceed 5000 characters'),
    
    body('stock_quantity')
      .optional()
      .isInt({ min: 0 })
      .withMessage('Stock quantity must be a non-negative integer')
  ]
};

// Parameter validation rules
const paramValidation = {
  id: [
    param('id')
      .isInt({ min: 1 })
      .withMessage('ID must be a positive integer')
  ],
  
  isbn: [
    param('isbn')
      .isLength({ min: 10, max: 20 })
      .withMessage('ISBN must be between 10 and 20 characters')
  ]
};

module.exports = {
  authorValidation,
  bookValidation,
  paramValidation
};

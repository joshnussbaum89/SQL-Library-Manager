const express = require('express');
const router = express.Router();
const Book = require('../models').Book;

/* Handler function to wrap each route. */
const asyncHandler = (cb) => {
  return async (req, res, next) => {
    try {
      await cb(req, res, next)
    } catch (error) {
      // Forward error to the global error handler
      next(error);
    }
  }
}

// Home
router.get('/', asyncHandler(async (req, res, next) => {
  // res.render('index', { title: 'Express' });
  const books = await Book.findAll();
}));

module.exports = router;

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

// Home route should redirect to the /books route
router.get('/', asyncHandler(async (req, res) => {
  res.redirect('/books');
}));

// Shows the full list of books
router.get('/books', asyncHandler(async (req, res) => {
  const books = await Book.findAll({ order: [["createdAt", "DESC"]] });
  res.render('index', {
    books,
    title: 'Books',
    id: books.id
  });
}));

// Shows the create new book form
router.get('/books/new', asyncHandler(async (req, res) => {
  res.render('new-book', { title: 'New Book' });
}));

// Posts a new book to the database
router.post('/books/new', asyncHandler(async (req, res) => {
  let book;
  try {
    book = await Book.create(req.body);
    res.redirect("/books/");
  } catch (error) {
    if (error.name === "SequelizeValidationError") {
      book = await Book.build(req.body);
      res.render("error", {
        message: error.message,
        status: error.status,
        stack: error.stack
      });
    } else {
      throw error;
    }
  }
}));

// Shows book detail form
router.get('/books/:id', asyncHandler(async (req, res) => {
  const book = await Book.findByPk(req.params.id);
  if (book) {
    res.render("update-book", {
      title: book.title,
      author: book.author,
      genre: book.genre,
      year: book.year,
      id: book.id
    });
  } else {
    res.sendStatus(404);
  }
}));

// Updates book info in the database
router.post('/books/:id', asyncHandler(async (req, res) => {
  const book = await Book.findByPk(req.params.id);
  await book.update(req.body);
  res.redirect('/books/');
}));

// Deletes a book. 
// Careful, this can’t be undone. 
//It can be helpful to create a new “test” book to test deleting
router.post('/books/:id/delete', asyncHandler(async (req, res) => {
  const book = await Book.findByPk(req.params.id);
  await book.destroy(req.body);
  res.redirect('/books/');
}));

module.exports = router;
